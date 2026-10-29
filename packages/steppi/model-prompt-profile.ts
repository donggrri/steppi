import { STEPI_COMPOSER_ADDENDUM } from "./prompts/composer-addendum.ts";
import { STEPI_GEMINI_FLASH_ADDENDUM } from "./prompts/gemini-flash-addendum.ts";
import { STEPI_GROK_ADDENDUM } from "./prompts/grok-addendum.ts";

/** System prompt section tag for the active StepPi per-model addendum. */
export const STEPI_MODEL_GUIDANCE_SECTION = "steppi_model_guidance";

export type ModelPromptProfile = "grok" | "composer" | "gemini-flash" | "neutral";

const COMPOSER_MODEL_PATTERN = /^composer-2(\.5)?$/i;

/** Maps provider + model id to a StepPi prompt profile (neutral = no addendum). */
export function resolveModelPromptProfile(provider: string, modelId: string): ModelPromptProfile {
	const providerNorm = provider.toLowerCase();
	const idNorm = modelId.toLowerCase();

	if (providerNorm === "grok" || providerNorm === "xai") {
		return "grok";
	}

	if (providerNorm === "cursor") {
		if (idNorm.includes("grok")) {
			return "grok";
		}
		if (COMPOSER_MODEL_PATTERN.test(modelId) || idNorm.startsWith("composer-2")) {
			return "composer";
		}
	}

	if (providerNorm === "antigravity" && idNorm.includes("gemini") && idNorm.includes("flash")) {
		return "gemini-flash";
	}

	return "neutral";
}

/** Footer/status label for the active profile (empty when neutral). */
export function modelPromptProfileStatusLabel(profile: ModelPromptProfile): string {
	switch (profile) {
		case "grok":
			return "grok";
		case "composer":
			return "composer";
		case "gemini-flash":
			return "flash";
		default:
			return "";
	}
}

/** Text appended via \`sections.steppi_model_guidance\`, or undefined when neutral. */
export function modelPromptProfileAddendum(profile: ModelPromptProfile): string | undefined {
	switch (profile) {
		case "grok":
			return STEPI_GROK_ADDENDUM;
		case "composer":
			return STEPI_COMPOSER_ADDENDUM;
		case "gemini-flash":
			return STEPI_GEMINI_FLASH_ADDENDUM;
		default:
			return undefined;
	}
}
