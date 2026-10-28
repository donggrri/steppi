import type { Model, Provider } from "@earendil-works/pi-ai";
import { xaiProvider } from "@earendil-works/pi-ai/providers/xai";
import type { ExtensionAPI, ExtensionContext } from "@earendil-works/pi-coding-agent";

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

function registerSteppiDashboardStatus(pi: ExtensionAPI): void {
	const displayProvider = (providerId: string) => (providerId === "xai" ? "grok" : providerId);

	let turn = 0;
	let runState: "idle" | "running" = "idle";

	const refresh = (ctx: ExtensionContext) => {
		const theme = ctx.ui.theme;
		const provider = displayProvider(ctx.model?.provider ?? "none");
		const run = runState === "running" ? theme.fg("accent", "running") : theme.fg("success", "idle");
		const turnLabel = turn > 0 ? theme.fg("dim", ` turn ${turn}`) : theme.fg("dim", " ready");
		ctx.ui.setStatus("steppi", `${run} · ${provider}${turnLabel}`);
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

/** steppi slice 1 extension entry: grok product id + dashboard footer status. */
export default function (pi: ExtensionAPI) {
	pi.registerProvider(grokProvider());
	registerSteppiDashboardStatus(pi);
}

/** Exported for tests that load the factory without default export resolution. */
export function steppiExtension(pi: ExtensionAPI) {
	pi.registerProvider(grokProvider());
	registerSteppiDashboardStatus(pi);
}
