import { fauxAssistantMessage, getCurrentSystemPrompt, type TranscriptContext } from "@earendil-works/pi-ai";
import { afterEach, describe, expect, it } from "vitest";
import {
	resolveModelPromptProfile,
	STEPI_MODEL_GUIDANCE_SECTION,
	steppiExtension,
} from "../../steppi/extensions/index.ts";
import { createHarness } from "./suite/harness.ts";

describe("steppi model prompt profiles", () => {
	const harnesses: Awaited<ReturnType<typeof createHarness>>[] = [];

	afterEach(() => {
		for (const harness of harnesses.splice(0)) harness.cleanup();
	});

	it.each([
		["grok", "grok-4.7", "grok"],
		["xai", "grok-4.7", "grok"],
		["xAI", "grok-4.7", "grok"],
		["cursor", "grok-4.7", "grok"],
		["cursor", "composer-2.5", "composer"],
		["cursor", "composer-2", "composer"],
		["antigravity", "gemini-3-8-flash", "gemini-flash"],
		["antigravity", "gemini-3.8-flash", "gemini-flash"],
		["anthropic", "claude-sonnet-4-5", "neutral"],
	] as const)("maps %s/%s to %s", (provider, modelId, profile) => {
		expect(resolveModelPromptProfile(provider, modelId)).toBe(profile);
	});

	it("injects the matching addendum into the provider system prompt", async () => {
		const prompts: string[] = [];
		const harness = await createHarness({
			provider: "cursor",
			models: [{ id: "composer-2.5" }],
			extensionFactories: [steppiExtension],
		});
		harnesses.push(harness);
		harness.setResponses([
			(context: TranscriptContext) => {
				prompts.push(getCurrentSystemPrompt(context.messages));
				return fauxAssistantMessage("ok");
			},
		]);

		await harness.session.prompt("hi");

		expect(prompts[0]).toContain("StepPi model profile: Composer");
		expect(prompts[0]).toContain(`<${STEPI_MODEL_GUIDANCE_SECTION}>`);
	});

	it("uses grok addendum for product grok id", async () => {
		let section: string | undefined;
		const harness = await createHarness({
			extensionFactories: [
				steppiExtension,
				(pi) => {
					pi.on("before_agent_start", (event) => {
						section = event.systemPromptOptions.sections[STEPI_MODEL_GUIDANCE_SECTION];
					});
				},
			],
		});
		harnesses.push(harness);
		const runtime = harness.session.modelRuntime;
		await runtime.refresh({ allowNetwork: false });
		const grok = runtime.getModel("grok", "grok-4.7");
		expect(grok).toBeDefined();
		await harness.authStorage.modify("grok", async () => ({ type: "api_key", key: "test" }));

		harness.setResponses([() => fauxAssistantMessage("ok")]);
		await harness.session.setModel(grok!);
		await harness.session.prompt("hi");

		expect(section).toContain("StepPi model profile: Grok");
	});

	it("clears guidance section for neutral models", async () => {
		const harness = await createHarness({ extensionFactories: [steppiExtension] });
		harnesses.push(harness);

		let sawSection = false;
		harness.setResponses([
			(context: TranscriptContext) => {
				const prompt = getCurrentSystemPrompt(context.messages);
				sawSection = prompt.includes(`<${STEPI_MODEL_GUIDANCE_SECTION}>`);
				return fauxAssistantMessage("ok");
			},
		]);

		await harness.session.prompt("hi");
		expect(sawSection).toBe(false);
	});
});
