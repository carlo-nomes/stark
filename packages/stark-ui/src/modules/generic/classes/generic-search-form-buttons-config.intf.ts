import { StarkFormButton, StarkFormCustomizablePredefinedButton, StarkFormDefaultPredefinedButton } from "./form-action.intf";

export interface StarkGenericSearchFormButtonsConfig {
	search?: StarkFormDefaultPredefinedButton;
	new?: StarkFormCustomizablePredefinedButton;
	reset?: StarkFormCustomizablePredefinedButton;
	custom?: StarkFormButton[];
}
