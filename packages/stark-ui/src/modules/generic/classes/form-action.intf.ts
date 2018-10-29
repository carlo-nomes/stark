import { StarkActionBarButtonColor } from "../../action-bar";

export interface StarkFormButtonBase {
	/**
	 * Color of the button
	 */
	buttonColor?: StarkActionBarButtonColor | string;

	/**
	 * Path to SVG icon from iconSets to display inside the form button. Ex: "pencil" (optional)
	 */
	icon?: string;

	/**
	 * Text to be displayed as label of the form button (optional)
	 */
	label?: string;

	/**
	 * Whether the form button should be enabled for user interaction or not (optional)
	 */
	isEnabled?: boolean;

	/**
	 * Custom CSS class to be set to the form button (optional)
	 */
	className?: string;
}

/**
 * Definition of a form button to be used in Stark
 * Provides a defined API for buttons configuration which can be reused by any client application if they want too.
 */
export interface StarkFormButton extends StarkFormButtonBase {
	/**
	 * The HTML id to be set to the form button
	 */
	id: string;

	/**
	 * Text to be displayed as label of the form button
	 */
	label: string;

	/**
	 * Function to be fired when form button is clicked
	 */
	onClick: Function;

	/**
	 * Whether the form button will be visible or not (optional)
	 */
	isVisible?: boolean;
}

/**
 * Definition of a form's default button to be used in an Stark generic form
 */
export interface StarkFormDefaultPredefinedButton extends StarkFormButtonBase {}

/**
 * Definition of a form's normal button to be used in an Stark generic form
 */
export interface StarkFormCustomizablePredefinedButton extends StarkFormButtonBase {
	/**
	 * Whether the form button will be visible or not (optional)
	 */
	isVisible?: boolean;
}
