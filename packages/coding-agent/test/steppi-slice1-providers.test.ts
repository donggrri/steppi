import { fauxAssistantMessage, fauxProvider } from "@earendil-works/pi-ai";
import { afterEach, describe, expect, it } from "vitest";
import { steppiExtension } from "../../steppi/extensions/index.ts";
import { parseArgs } from "../src/cli/args.ts";
import { checkProviderAuth } from "../src/cli/auth-check.ts";
import { createHarness } from "./suite/harness.ts";

describe("steppi slice 1 providers", () => {
	const harnesses: Awaited<ReturnType<typeof createHarness>>[] = [];

	afterEach(() => {
		for (const harness of harnesses.splice(0)) harness.cleanup();
	});

	it("registers product id grok with xAI-backed models", async () => {
		const harness = await createHarness({ extensionFactories: [steppiExtension] });
		harnesses.push(harness);
		const runtime = harness.session.modelRuntime;
		await runtime.refresh({ allowNetwork: false });

		const grokModel = runtime.getModel("grok", "grok-4.7");
		expect(grokModel).toBeDefined();
		expect(grokModel?.provider).toBe("grok");
	});

	it("routes cursor and antigravity provider ids when registered", async () => {
		const cursor = fauxProvider({ provider: "cursor", models: [{ id: "composer-2.5" }] });
		const antigravity = fauxProvider({ provider: "antigravity", models: [{ id: "antigravity/gemini-3" }] });
		cursor.setResponses([() => fauxAssistantMessage("cursor-ok")]);
		antigravity.setResponses([() => fauxAssistantMessage("agy-ok")]);

		const harness = await createHarness({
			extensionFactories: [
				steppiExtension,
				(pi) => {
					pi.registerProvider(cursor.provider.id, {
						api: cursor.api,
						baseUrl: cursor.getModel().baseUrl,
						apiKey: "test",
						models: cursor.models,
						streamSimple: cursor.provider.streamSimple,
					});
					pi.registerProvider(antigravity.provider.id, {
						api: antigravity.api,
						baseUrl: antigravity.getModel().baseUrl,
						apiKey: "test",
						models: antigravity.models,
						streamSimple: antigravity.provider.streamSimple,
					});
				},
			],
		});
		harnesses.push(harness);
		const runtime = harness.session.modelRuntime;
		await runtime.refresh({ allowNetwork: false });

		expect(runtime.getModel("cursor", "composer-2.5")?.provider).toBe("cursor");
		expect(runtime.getModel("antigravity", "antigravity/gemini-3")?.provider).toBe("antigravity");
	});

	it("reports grok auth not_ready without credentials (names grok)", async () => {
		const harness = await createHarness({ extensionFactories: [steppiExtension] });
		harnesses.push(harness);
		const result = await checkProviderAuth(parseArgs(["--provider", "grok"]), harness.session.modelRuntime);
		expect(result.status).toBe("not_ready");
		expect(result.provider).toBe("grok");
	});

	it("reports missing antigravity backend with provider id in message", async () => {
		const antigravity = fauxProvider({ provider: "antigravity", models: [{ id: "demo" }] });
		const harness = await createHarness({
			extensionFactories: [
				steppiExtension,
				(pi) => {
					pi.registerProvider(antigravity.provider.id, {
						api: antigravity.api,
						baseUrl: antigravity.getModel().baseUrl,
						apiKey: "$MISSING_ANTIGRAVITY",
						models: antigravity.models,
						streamSimple: antigravity.provider.streamSimple,
					});
				},
			],
		});
		harnesses.push(harness);
		const result = await checkProviderAuth(parseArgs(["--provider", "antigravity"]), harness.session.modelRuntime);
		expect(result.status).toBe("not_ready");
		expect(result.provider).toBe("antigravity");
	});
});
