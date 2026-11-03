import type { Model, Provider } from "@earendil-works/pi-ai";
import { xaiProvider } from "@earendil-works/pi-ai/providers/xai";
import type { ExtensionAPI, ExtensionContext } from "@earendil-works/pi-coding-agent";
import {
	modelPromptProfileAddendum,
	modelPromptProfileStatusLabel,
	resolveModelPromptProfile,
	STEPI_MODEL_GUIDANCE_SECTION,
	type ModelPromptProfile,
} from "../model-prompt-profile.ts";

type XaiApi = ReturnType<typeof xaiProvider> extends Provider<infer T> ? T : never;
type XaiModel = Model<XaiApi>;

const XAI = xaiProvider();

function asGrokModel(model: XaiModel): XaiModel {
	if (model.provider === "grok") return model;
	return { ...model, provider: "grok" };
}

/** Product provider id `grok` → xAI transport/auth (Pi built-in `xai`). */
export function grokProvider(): Provider<XaiApi> {
	return {
		...XAI,
		id: "grok",
		name: "Grok",
		getModels: () => XAI.getModels().map(asGrokModel),
		getAllModels: XAI.getAllModels
			? () => XAI.getAllModels!().map((model) => asGrokModel(model as XaiModel))
			: undefined,
		stream: (model, context, options) => XAI.stream(asGrokModel(model), context, options),
		streamSimple: (model, context, options) => XAI.streamSimple(asGrokModel(model), context, options),
		fetchDeferred: XAI.fetchDeferred
			? (model, handle, options) => XAI.fetchDeferred!(asGrokModel(model), handle, options)
			: undefined,
		cancelDeferred: XAI.cancelDeferred
			? (model, handle, options) => XAI.cancelDeferred!(asGrokModel(model), handle, options)
			: undefined,
	};
}

function applyModelPromptProfileToOptions(
	provider: string | undefined,
	modelId: string | undefined,
	sections: Record<string, string>,
): ModelPromptProfile {
	if (!provider || !modelId) {
		delete sections[STEPI_MODEL_GUIDANCE_SECTION];
		return "neutral";
	}
	const profile = resolveModelPromptProfile(provider, modelId);
	const addendum = modelPromptProfileAddendum(profile);
	if (addendum) {
		sections[STEPI_MODEL_GUIDANCE_SECTION] = addendum;
	} else {
		delete sections[STEPI_MODEL_GUIDANCE_SECTION];
	}
	return profile;
}

function registerSteppiModelPromptProfiles(pi: ExtensionAPI): void {
	pi.on("before_agent_start", async (event, ctx) => {
		applyModelPromptProfileToOptions(ctx.model?.provider, ctx.model?.id, event.systemPromptOptions.sections);
	});
}

function registerSteppiDashboardStatus(pi: ExtensionAPI): void {
	const displayProvider = (providerId: string) => (providerId === "xai" ? "grok" : providerId);

	let turn = 0;
	let runState: "idle" | "running" = "idle";

	const refresh = (ctx: ExtensionContext) => {
		const theme = ctx.ui.theme;
		const provider = displayProvider(ctx.model?.provider ?? "none");
		const profile = resolveModelPromptProfile(ctx.model?.provider ?? "", ctx.model?.id ?? "");
		const profileLabel = modelPromptProfileStatusLabel(profile);
		const profileSuffix = profileLabel ? theme.fg("dim", ` · ${profileLabel}`) : "";
		const run = runState === "running" ? theme.fg("accent", "running") : theme.fg("success", "idle");
		const turnLabel = turn > 0 ? theme.fg("dim", ` turn ${turn}`) : theme.fg("dim", " ready");
		ctx.ui.setStatus("steppi", `${run} · ${provider}${profileSuffix}${turnLabel}`);
	};

	pi.on("model_select", async (_event, ctx) => {
		refresh(ctx);
	});

	pi.on("session_start", async (_event, ctx) => {
		turn = 0;
		runState = "idle";
		refresh(ctx);
	});

	pi.on("turn_start", async (_event, ctx) => {
		turn++;
		runState = "running";
		refresh(ctx);
	});

	pi.on("turn_end", async (_event, ctx) => {
		runState = "idle";
		refresh(ctx);
	});

	pi.on("agent_start", async (_event, ctx) => {
		runState = "running";
		refresh(ctx);
	});

	pi.on("agent_end", async (_event, ctx) => {
		runState = "idle";
		refresh(ctx);
	});
}

/** steppi extension: grok product id, per-model prompt profiles, dashboard footer status. */
export default function (pi: ExtensionAPI) {
	pi.registerProvider(grokProvider());
	registerSteppiModelPromptProfiles(pi);
	registerSteppiDashboardStatus(pi);
}

/** Exported for tests that load the factory without default export resolution. */
export function steppiExtension(pi: ExtensionAPI) {
	pi.registerProvider(grokProvider());
	registerSteppiModelPromptProfiles(pi);
	registerSteppiDashboardStatus(pi);
}

export {
	modelPromptProfileAddendum,
	modelPromptProfileStatusLabel,
	resolveModelPromptProfile,
	STEPI_MODEL_GUIDANCE_SECTION,
	type ModelPromptProfile,
} from "../model-prompt-profile.ts";
