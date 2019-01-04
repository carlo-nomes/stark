import { ReplaySubject, Subscription } from "rxjs";
import { map, take } from "rxjs/operators";
import { OnDestroy, OnInit } from "@angular/core";

import { AbstractStarkFormComponent } from "../classes/abstract-form-component";
import { StarkGenericSearchService } from "../classes/generic-search.service.intf";
import { StarkSearchState } from "../classes/search-state.entity.intf";
import { StarkLoggingService } from "@nationalbankbelgium/stark-core";
import { StarkFormUtil } from "../../../util/form";
import { FormGroup } from "@angular/forms";

export abstract class AbstractStarkSearchComponent<T, E> extends AbstractStarkFormComponent<E> implements OnInit, OnDestroy {
	/** @internal */
	private _latestResults: Readonly<T[]>;
	private searchStateSubscription: Subscription;

	protected genericSearchService: StarkGenericSearchService<T, E>;
	/**
	 * Service that provides an easy way to change the visibility of a progress indicator.
	 */
	// protected progressService: StarkProgressIndicatorService;
	/**
	 * Whether a new search should be performed automatically after initialization in case the last search criteria can be fetched
	 * from the application state (ngrx-store)
	 */
	protected performSearchOnInit: boolean;
	/**
	 * Whether the latest emitted results by the emitResult() method will be kept in the latestResults variable
	 */
	protected preserveLatestResults: boolean;
	/**
	 * The topic of the progress indicator to be shown/hidden when performing the search.
	 */
	// FIXME Uncomment this when progressService is implemented
	// protected progressTopic: string;
	/**
	 * Observable that will emit the search results. This Observable is created as soon as the Search Page controller is constructed
	 * and the first value it emits is an empty array in order to avoid the having undefined values passed down to the subscriber(s).
	 */
	protected results$: ReplaySubject<T[]>;

	/**
	 *
	 * @param genericSearchService - Service implementing the StarkGenericSearchService interface providing all the necessary methods to search items.
	 * @param logger - The logging service of the application
	 */
	protected constructor(
		genericSearchService: StarkGenericSearchService<T, E>,
		logger: StarkLoggingService /*,
					   progressService: StarkProgressIndicatorService*/
	) {
		super(logger);
		this.genericSearchService = genericSearchService;
		// FIXME Uncomment this when progressService is implemented
		// this.progressService = progressService;
		// this.progressTopic = "";

		this.performSearchOnInit = true;
		this.preserveLatestResults = false;
	}

	public ngOnInit(): void {
		// it will re-emit the latest value whenever a new observer subscribes to it
		// so an empty array can be emitted as the result$ initial value (to avoid having undefined results)
		this.results$ = new ReplaySubject<T[]>(1);
		// initially an empty array is emitted
		this.emitResult([]);

		// if a search was done previously (saved in the Redux state)
		// then the search is automatically performed on initialization (only if the performSearchOnInit option is TRUE)
		this.searchStateSubscription = this.genericSearchService
			.getSearchState()
			.pipe(
				map((searchState: StarkSearchState<E>) => {
					if (searchState.hasBeenSearched && this.performSearchOnInit) {
						this.performSearch(searchState.criteria);
					}
					return searchState.criteria;
				})
			)
			.subscribe((searchCriteria: E) => {
				this.setOriginalCopy(searchCriteria);
			});
	}

	public ngOnDestroy(): void {
		this.searchStateSubscription.unsubscribe();
	}

	/**
	 * Invoke the search passing the formGroup's working copy only if the Search formGroup is valid
	 * @param formGroup - The 'search' formGroup
	 */
	public onSearch(formGroup: FormGroup): void {
		if (StarkFormUtil.isFormGroupValid(formGroup)) {
			this.workingCopy = formGroup.getRawValue();
			this.performSearch(this.workingCopy);
		}
	}

	/**
	 * Invoke the genericSearchService.createNew() method
	 */
	public onNew(): void {
		if (typeof this.genericSearchService.createNew !== "undefined") {
			this.genericSearchService.createNew();
		}
	}

	/**
	 * Invoke the genericSearchService.resetSearchState() method and clears the results
	 */
	public onReset(form: FormGroup): void {
		this.genericSearchService.resetSearchState();
		StarkFormUtil.setFormChildControlsState(form, ["untouched", "pristine"]);
		StarkFormUtil.setFormGroupState(form, ["untouched", "pristine"]);
		this.emitResult([]);
	}

	/**
	 * Invoke the genericSearchService.search() method and emits the results. If no searchCriteria object is passed, then the current
	 * form's working copy is used.
	 */
	public performSearch(searchCriteria: E = this.workingCopy): void {
		this.performSearchOnInit = false; // prevent further automatic searches due to the subscription to StarkSearchState changes in NgOnInit

		
		console.log("----- typeof criteria ?", typeof searchCriteria);
		console.log("---- criteria ?", searchCriteria);
		// FIXME Uncomment this when progressService is implemented
		// this.showProgress(true);

		this.genericSearchService
			.search(searchCriteria)
			.pipe(
				take(1) // this ensures that the observable will be automatically unsubscribed after emitting the value
			)
			.subscribe(
				(result: T[]) => {
					this.emitResult(result);
					// FIXME Uncomment this when progressService is implemented
					// this.showProgress(false);
				},
				() => {
					// hide the progress in case of error
					// FIXME Uncomment this when progressService is implemented
					// this.showProgress(false);
				}
			);
	}

	/**
	 * The latest search results that have been emitted in the results$ Observable.
	 */
	public get latestResults(): Readonly<T[]> {
		return this._latestResults;
	}

	/**
	 * Call the progressService show/hide methods in case there is a progressTopic defined
	 * @param show - Whether to show the progress indicator or not
	 */
	// FIXME Uncomment this when ProgressService is implemented
	// protected showProgress(show: boolean): void {
	// if (this.progressTopic && this.progressTopic !== "") {
	// 	if (show) {
	// 		this.progressService.show(this.progressTopic);
	// 	} else {
	// 		this.progressService.hide(this.progressTopic);
	// 	}
	// }
	// }

	/**
	 * Emit the latest results and optionally keeps a reference to them if the preserveLatestResults option is enabled.
	 */
	protected emitResult(result: T[]): void {
		if (this.preserveLatestResults) {
			this._latestResults = result;
		}
		this.results$.next(result);
	}
}
