/* tslint:disable:no-null-keyword */
import { Component, Inject, OnDestroy } from "@angular/core";
import { STARK_LOGGING_SERVICE, StarkLoggingService } from "@nationalbankbelgium/stark-core";
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from "@angular/forms";
import { MatCheckboxChange } from "@angular/material/checkbox";
import { Subscription } from "rxjs";
import map from "lodash-es/map";

@Component({
	selector: "demo-date-range-picker",
	templateUrl: "./demo-date-range-picker.component.html"
})
export class DemoDateRangePickerComponent implements OnDestroy {
	public static noFebruaryValidator(control: AbstractControl): ValidationErrors | null {
		const { value } = control;
		return value instanceof Date && value.getMonth() === 1 ? { inFebruary: true } : null; // date counts months from 0
	}

	public dateRangeFormGroup = new FormGroup({
		startDate: new FormControl(null, Validators.compose([DemoDateRangePickerComponent.noFebruaryValidator])),
		endDate: new FormControl(null, Validators.compose([DemoDateRangePickerComponent.noFebruaryValidator]))
	});

	/**
	 * List of subscriptions to be unsubscribed when component is destroyed
	 */
	private _subs: Subscription[] = [];

	public getErrorMessages(control: AbstractControl): string[] {
		return map(
			control.errors || [],
			(_value: any, key: string): string => {
				switch (key) {
					case "required":
						return "Date is required";
					case "startBeforeEnd":
						return "Start date should be before end date";
					case "endAfterStart":
						return "End date should be after start date";
					case "inFebruary":
						return "Date should not be in February";
					default:
						return "";
				}
			}
		);
	}

	public constructor(@Inject(STARK_LOGGING_SERVICE) public logger: StarkLoggingService) {
		this._subs.push(this.dateRangeFormGroup.valueChanges.subscribe((v: any) => this.logger.debug("formGroup:", v)));
	}

	public onDateRangeFormGroupDisableCheckboxChange(event: MatCheckboxChange): void {
		if (event.checked) {
			this.dateRangeFormGroup.disable();
		} else {
			this.dateRangeFormGroup.enable();
		}
	}

	public ngOnDestroy(): void {
		for (const subscription of this._subs) {
			subscription.unsubscribe()
		}
	}
}
