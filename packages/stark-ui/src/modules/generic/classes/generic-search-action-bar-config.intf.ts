import { StarkActionBarConfig, StarkCustomizablePredefinedAction, StarkDefaultPredefinedAction } from "../../action-bar";

export interface StarkGenericSearchActionBarConfig extends StarkActionBarConfig {
	search?: StarkDefaultPredefinedAction;
	new?: StarkCustomizablePredefinedAction;
	reset?: StarkCustomizablePredefinedAction;
}
