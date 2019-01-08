import {
	AfterContentInit,
	Component,
	ContentChild,
	ElementRef,
	EventEmitter,
	Inject,
	Input,
	OnChanges,
	OnInit,
	Output,
	Renderer2,
	SimpleChanges,
	ViewEncapsulation
} from "@angular/core";
import {
	StarkFormButton,
	StarkFormCustomizablePredefinedButton,
	StarkFormDefaultPredefinedButton,
	StarkGenericSearchActionBarConfig,
	StarkGenericSearchFormButtonsConfig
} from "../../classes";
import { StarkAction, StarkActionBarConfig, StarkCustomizablePredefinedAction, StarkDefaultPredefinedAction } from "../../../action-bar";
import { STARK_LOGGING_SERVICE, StarkLoggingService } from "@nationalbankbelgium/stark-core";
import { FormGroup } from "@angular/forms";
import { animate, state, style, transition, trigger } from "@angular/animations";
import { AbstractStarkUiComponent } from "../../../../common/classes/abstract-component";

const _isEqual: Function = require("lodash/isEqual");

/**
 * Name of the component
 */
const componentName: string = "stark-generic-search";

export interface StarkSearchFormComponent {
	searchForm: FormGroup;
}

declare type UnusedLabelProps = "labelActivated" | "labelSwitchFunction";
declare type UnusedIconProps = "iconActivated" | "iconSwitchFunction";
declare type StarkDefaultPredefinedActionBarGenericAction = Required<
	Pick<StarkDefaultPredefinedAction, Exclude<keyof StarkDefaultPredefinedAction, UnusedLabelProps | UnusedIconProps>>
> &
	Pick<StarkDefaultPredefinedAction, UnusedIconProps>;
declare type StarkCustomizablePredefinedActionBarGenericAction = Required<
	Pick<StarkCustomizablePredefinedAction, Exclude<keyof StarkCustomizablePredefinedAction, UnusedLabelProps | UnusedIconProps>>
> &
	Partial<Pick<StarkCustomizablePredefinedAction, UnusedIconProps>>;

interface StarkGenericSearchActionBarConfigRequired extends StarkGenericSearchActionBarConfig, StarkActionBarConfig {
	search: StarkDefaultPredefinedActionBarGenericAction;
	new: StarkCustomizablePredefinedActionBarGenericAction;
	reset: StarkCustomizablePredefinedActionBarGenericAction;
}

interface StarkGenericSearchFormButtonsConfigRequired extends StarkGenericSearchFormButtonsConfig {
	search: Required<StarkFormDefaultPredefinedButton>;
	new: Required<StarkFormCustomizablePredefinedButton>;
	reset: Required<StarkFormCustomizablePredefinedButton>;
	custom: StarkFormButton[];
}

/**
 * Component to display a generic search form with an action bar and form buttons for these actions:
 *
 * - New: call the onNew output function
 * - Search: call the onSearch output function
 * - Reset: call the onReset output function
 *
 */
@Component({
	selector: "stark-generic-search",
	templateUrl: "./generic-search.component.html",
	animations: [trigger("collapse", [state("closed", style({ opacity: 0, height: 0 })), transition("* <=> closed", animate(400))])],
	encapsulation: ViewEncapsulation.None,
	// We need to use host instead of @HostBinding: https://github.com/NationalBankBelgium/stark/issues/664
	host: {
		class: componentName
	}
})
export class StarkGenericSearchComponent extends AbstractStarkUiComponent implements OnInit, OnChanges, AfterContentInit {
	/**
	 * Configuration object for the action bar to be shown above the generic form
	 */
	@Input()
	public formActionBarConfig?: StarkGenericSearchActionBarConfig;

	/**
	 * Configuration object for the buttons to be shown in the generic form
	 */
	@Input()
	public formButtonsConfig?: StarkGenericSearchFormButtonsConfig;

	/**
	 * Whether the generic form should be hidden. Default: false
	 */
	@Input()
	public isFormHidden: boolean = false;

	/**
	 * HTML id of action bar component.
	 */
	@Input()
	public formHtmlId: string = "stark-generic-search-form";

	/**
	 * Whether the generic form should be hidden once the search is triggered.
	 * Default: false
	 */
	@Input()
	public hideOnSearch?: boolean;

	/**
	 * Callback function to be called when the "New" button is clicked (in case it is shown)
	 */
	@Output()
	public newTriggered: EventEmitter<void> = new EventEmitter<void>();

	/**
	 * Callback function to be called when the "Reset" button is clicked.
	 * The form model object is passed as parameter to this function.
	 */
	@Output()
	public resetTriggered: EventEmitter<FormGroup> = new EventEmitter<FormGroup>();

	/**
	 * Callback function to be called when the "Search" button is clicked.
	 * The form model object is passed as parameter to this function.
	 */
	@Output()
	public searchTriggered: EventEmitter<FormGroup> = new EventEmitter<FormGroup>();

	/**
	 * Callback function to be called when the visibility of the generic form changes.
	 * A boolean is passed as parameter to indicate whether the generic form is visible or not.
	 */
	@Output()
	public formVisibilityChanged?: EventEmitter<boolean> = new EventEmitter<boolean>();

	@ContentChild("searchForm")
	public searchFormComponent: StarkSearchFormComponent;

	public actionBarConfig: StarkActionBarConfig;
	public normalizedFormActionBarConfig: StarkGenericSearchActionBarConfigRequired;
	public normalizedFormButtonsConfig: StarkGenericSearchFormButtonsConfigRequired;
	public genericForm: FormGroup;

	public constructor(
		@Inject(STARK_LOGGING_SERVICE) private logger: StarkLoggingService,
		protected renderer: Renderer2,
		protected elementRef: ElementRef
	) {
		super(renderer, elementRef);
	}

	/**
	 * Component lifecycle hook
	 */
	public ngAfterContentInit(): void {
		if (typeof this.searchFormComponent !== "undefined") {
			this.genericForm = this.searchFormComponent.searchForm;
		}
	}

	/**
	 * Component lifecycle hook
	 */
	public ngOnInit(): void {
		this.normalizedFormButtonsConfig = this.normalizeFormButtonsConfig(this.formButtonsConfig);
		this.normalizedFormActionBarConfig = this.normalizeFormActionBarConfig(this.formActionBarConfig);
		this.actionBarConfig = this.buildActionBarConfig(this.normalizedFormActionBarConfig);

		this.logger.debug(componentName + ": component initialized");
	}

	/**
	 * Component lifecycle hook
	 */
	public ngOnChanges(changesObj: SimpleChanges): void {
		if (
			changesObj["formButtonsConfig"] &&
			!changesObj["formButtonsConfig"].isFirstChange() &&
			!_isEqual(this.formButtonsConfig, this.normalizedFormButtonsConfig)
		) {
			this.normalizedFormButtonsConfig = this.normalizeFormButtonsConfig(this.formButtonsConfig);
		}

		if (
			changesObj["formActionBarConfig"] &&
			!changesObj["formActionBarConfig"].isFirstChange() &&
			!_isEqual(this.formActionBarConfig, this.normalizedFormActionBarConfig)
		) {
			this.normalizedFormActionBarConfig = this.normalizeFormActionBarConfig(this.formActionBarConfig);
			this.actionBarConfig = this.buildActionBarConfig(this.normalizedFormActionBarConfig);
		}
	}

	public normalizeFormButtonsConfig(config?: StarkGenericSearchFormButtonsConfig): StarkGenericSearchFormButtonsConfigRequired {
		config = config || {};

		function normalizeButtonConfig(
			buttonConfig: StarkFormCustomizablePredefinedButton,
			defaultConfig: Required<StarkFormCustomizablePredefinedButton>
		): Required<StarkFormCustomizablePredefinedButton> {
			return {
				icon: typeof buttonConfig.icon !== "undefined" ? buttonConfig.icon : defaultConfig.icon,
				label: typeof buttonConfig.label !== "undefined" ? buttonConfig.label : defaultConfig.label,
				isEnabled: typeof buttonConfig.isEnabled !== "undefined" ? buttonConfig.isEnabled : defaultConfig.isEnabled,
				isVisible: typeof buttonConfig.isVisible !== "undefined" ? buttonConfig.isVisible : defaultConfig.isVisible,
				className: typeof buttonConfig.className !== "undefined" ? buttonConfig.className : defaultConfig.className,
				buttonColor: typeof buttonConfig.buttonColor !== "undefined" ? buttonConfig.buttonColor : defaultConfig.buttonColor
			};
		}

		function normalizeDefaultButtonConfig(
			buttonConfig: StarkFormDefaultPredefinedButton,
			defaultConfig: Required<StarkFormDefaultPredefinedButton>
		): Required<StarkFormDefaultPredefinedButton> {
			return {
				icon: typeof buttonConfig.icon !== "undefined" ? buttonConfig.icon : defaultConfig.icon,
				label: typeof buttonConfig.label !== "undefined" ? buttonConfig.label : defaultConfig.label,
				isEnabled: typeof buttonConfig.isEnabled !== "undefined" ? buttonConfig.isEnabled : defaultConfig.isEnabled,
				className: typeof buttonConfig.className !== "undefined" ? buttonConfig.className : defaultConfig.className,
				buttonColor: typeof buttonConfig.buttonColor !== "undefined" ? buttonConfig.buttonColor : defaultConfig.buttonColor
			};
		}

		// set default values
		const normalizedConfig: StarkGenericSearchFormButtonsConfigRequired = {
			search: {
				icon: "",
				label: "STARK.ICONS.SEARCH",
				isEnabled: true,
				className: "mat-raised-button",
				buttonColor: "primary"
			},
			new: {
				icon: "",
				label: "STARK.ICONS.NEW_ITEM",
				isEnabled: true,
				isVisible: true,
				className: "stark-outline mat-raised-button",
				buttonColor: "primary"
			},
			reset: {
				icon: "",
				label: "STARK.ICONS.RESET",
				isEnabled: true,
				isVisible: true,
				className: "stark-outline",
				buttonColor: "primary"
			},
			custom: []
		};

		if (config.search) {
			normalizedConfig.search = normalizeDefaultButtonConfig(config.search, normalizedConfig.search);
		}

		if (config.new) {
			normalizedConfig.new = normalizeButtonConfig(config.new, normalizedConfig.new);
		}

		if (config.reset) {
			normalizedConfig.reset = normalizeButtonConfig(config.reset, normalizedConfig.reset);
		}

		if (config.custom !== undefined) {
			normalizedConfig.custom = config.custom;
		}

		return normalizedConfig;
	}

	public normalizeFormActionBarConfig(config?: StarkGenericSearchActionBarConfig): StarkGenericSearchActionBarConfigRequired {
		config = config || { actions: [] };

		function normalizeDefaultActionConfig(
			actionConfig: StarkDefaultPredefinedAction,
			defaultConfig: StarkDefaultPredefinedActionBarGenericAction
		): StarkDefaultPredefinedActionBarGenericAction {
			return {
				icon: typeof actionConfig.icon !== "undefined" ? actionConfig.icon : defaultConfig.icon,
				label: typeof actionConfig.label !== "undefined" ? actionConfig.label : defaultConfig.label,
				isEnabled: typeof actionConfig.isEnabled !== "undefined" ? actionConfig.isEnabled : defaultConfig.isEnabled,
				iconActivated: actionConfig.iconActivated,
				iconSwitchFunction: actionConfig.iconSwitchFunction,
				className: typeof actionConfig.className !== "undefined" ? actionConfig.className : defaultConfig.className,
				buttonColor: typeof actionConfig.buttonColor !== "undefined" ? actionConfig.buttonColor : defaultConfig.buttonColor
			};
		}

		function normalizeActionConfig(
			actionConfig: StarkCustomizablePredefinedAction,
			defaultConfig: StarkCustomizablePredefinedActionBarGenericAction
		): StarkCustomizablePredefinedActionBarGenericAction {
			return {
				icon: typeof actionConfig.icon !== "undefined" ? actionConfig.icon : defaultConfig.icon,
				label: typeof actionConfig.label !== "undefined" ? actionConfig.label : defaultConfig.label,
				isEnabled: typeof actionConfig.isEnabled !== "undefined" ? actionConfig.isEnabled : defaultConfig.isEnabled,
				isVisible: typeof actionConfig.isVisible !== "undefined" ? actionConfig.isVisible : defaultConfig.isVisible,
				iconActivated: actionConfig.iconActivated,
				iconSwitchFunction: actionConfig.iconSwitchFunction,
				className: typeof actionConfig.className !== "undefined" ? actionConfig.className : defaultConfig.className,
				buttonColor: typeof actionConfig.buttonColor !== "undefined" ? actionConfig.buttonColor : defaultConfig.buttonColor
			};
		}

		// set default values
		const normalizedConfig: StarkGenericSearchActionBarConfigRequired = {
			search: {
				icon: "magnify",
				label: "STARK.ICONS.SEARCH",
				isEnabled: true,
				className: "",
				buttonColor: "primary"
			},
			new: {
				icon: "note-plus",
				label: "STARK.ICONS.NEW_ITEM",
				isEnabled: true,
				isVisible: true,
				className: "",
				buttonColor: "primary"
			},
			reset: {
				icon: "undo",
				label: "STARK.ICONS.RESET",
				isEnabled: true,
				isVisible: true,
				className: "",
				buttonColor: "primary"
			},
			actions: [],
			isPresent: true // action bar is present by default, should be explicitly set to false to remove it
		};

		if (config.search) {
			normalizedConfig.search = normalizeDefaultActionConfig(config.search, normalizedConfig.search);
		}

		if (config.new) {
			normalizedConfig.new = normalizeActionConfig(config.new, normalizedConfig.new);
		}

		if (config.reset) {
			normalizedConfig.reset = normalizeActionConfig(config.reset, normalizedConfig.reset);
		}

		if (config.actions !== undefined) {
			normalizedConfig.actions = config.actions;
		}

		if (config.isPresent !== undefined) {
			normalizedConfig.isPresent = config.isPresent;
		}

		return normalizedConfig;
	}

	public buildActionBarConfig(searchFormActionBarConfig: StarkGenericSearchActionBarConfig): StarkActionBarConfig {
		// TODO: replace this code with a Type to convert all optional props to required
		// see https://github.com/JakeGinnivan/TypeScript-Handbook/commit/a02ef7023f2fb513dc35d8de35be23b926ec82e3
		const predefinedSearchAction: StarkDefaultPredefinedAction = <StarkDefaultPredefinedAction>searchFormActionBarConfig.search;
		const actionSearch: StarkAction = {
			label: <string>predefinedSearchAction.label,
			icon: <string>predefinedSearchAction.icon,
			isEnabled: <boolean>predefinedSearchAction.isEnabled,
			iconActivated: predefinedSearchAction.iconActivated,
			iconSwitchFunction: predefinedSearchAction.iconSwitchFunction,
			className: predefinedSearchAction.className,
			id: "search-action-bar",
			isVisible: true,
			actionCall: (): void => {
				this.searchTriggered.emit(this.genericForm);
			}
		};

		const predefinedResetAction: StarkCustomizablePredefinedAction = <StarkCustomizablePredefinedAction>searchFormActionBarConfig.reset;
		const actionReset: StarkAction = {
			label: <string>predefinedResetAction.label,
			icon: <string>predefinedResetAction.icon,
			isEnabled: <boolean>predefinedResetAction.isEnabled,
			isVisible: <boolean>predefinedResetAction.isVisible,
			iconActivated: predefinedResetAction.iconActivated,
			iconSwitchFunction: predefinedResetAction.iconSwitchFunction,
			className: predefinedResetAction.className,
			id: "undo-action-bar",
			actionCall: (): void => {
				if (this.resetTriggered) {
					this.resetTriggered.emit(this.genericForm);
				}
			}
		};

		const predefinedNewAction: StarkCustomizablePredefinedAction = <StarkCustomizablePredefinedAction>searchFormActionBarConfig.new;
		const actionNew: StarkAction = {
			label: <string>predefinedNewAction.label,
			icon: <string>predefinedNewAction.icon,
			isEnabled: <boolean>predefinedNewAction.isEnabled,
			isVisible: <boolean>predefinedNewAction.isVisible,
			iconActivated: predefinedNewAction.iconActivated,
			iconSwitchFunction: predefinedNewAction.iconSwitchFunction,
			className: predefinedNewAction.className,
			id: "new-action-bar",
			actionCall: (): void => {
				if (this.newTriggered) {
					this.newTriggered.emit();
				}
			}
		};

		return {
			isPresent: searchFormActionBarConfig.isPresent,
			actions: [actionNew, actionSearch, actionReset, ...searchFormActionBarConfig.actions]
		};
	}

	public triggerSearch(): void {
		// TODO Check if we want to check the validity of the form before sending it.
		// if (this.genericForm.valid) {
		this.searchTriggered.emit(this.genericForm);
		if (this.hideOnSearch) {
			this.hideForm();
		}
		// }
	}

	public hideForm(): void {
		if (!this.isFormHidden) {
			this.isFormHidden = true;

			// by the moment, the callback is called only when the form is hidden
			if (this.formVisibilityChanged) {
				this.formVisibilityChanged.emit(!this.isFormHidden);
			}
		}
	}

	/**
	 * @ignore
	 */
	public trackItemFn(formButton: StarkFormButton): string {
		return formButton.id;
	}
}
