import { Component, Inject, OnDestroy, OnInit } from "@angular/core";
import { STARK_LOGGING_SERVICE, StarkLoggingService } from "@nationalbankbelgium/stark-core";
import { ReferenceLink } from "../../../shared/components";
import { AbstractStarkSearchComponent, StarkPaginationConfig, StarkTableColumnProperties } from "@nationalbankbelgium/stark-ui";
import { GenericObject, GenericObjectSearchCriteria } from "./entities";
import { DEMO_GENERIC_SERVICE, DemoGenericService } from "./services";

@Component({
	selector: "demo-generic-search",
	templateUrl: "./demo-generic-search-page.component.html"
})
export class DemoGenericSearchPageComponent extends AbstractStarkSearchComponent<GenericObject, GenericObjectSearchCriteria>
	implements OnInit, OnDestroy {
	public hideSearch: boolean;

	public referenceList: ReferenceLink[] = [
		{
			label: "Stark Generic Search component",
			url: "https://stark.nbb.be/api-docs/stark-ui/latest/components/StarkGenericSearchComponent.html"
		}
	];

	public columnsProperties: StarkTableColumnProperties[];
	public searchResults: GenericObject[];
	public paginationConfig: StarkPaginationConfig;

	public constructor(
		@Inject(STARK_LOGGING_SERVICE) logger: StarkLoggingService,
		@Inject(DEMO_GENERIC_SERVICE) public demoGenericService: DemoGenericService
	) {
		super(demoGenericService, logger);

		this.performSearchOnInit = true; // Turn on automatic search (last search criteria)
		this.preserveLatestResults = true; // Keep a reference to the latest results in the latestResults variable
	}

	/**
	 * Component lifecycle hook
	 */
	public ngOnInit(): void {
		super.ngOnInit();

		this.results$.subscribe((genericObjects: GenericObject[]) => (this.searchResults = genericObjects));

		this.columnsProperties = [
			{
				name: "hero",
				label: "Hero",
				isFilterable: true,
				isSortable: true
			},
			{
				name: "movie",
				label: "Movie",
				isFilterable: true,
				isSortable: true
			},
			{
				name: "year",
				label: "Year",
				isFilterable: true,
				isSortable: true
			}
		];

		this.paginationConfig = {
			isExtended: false,
			itemsPerPage: 10,
			itemsPerPageOptions: [10, 20, 50],
			itemsPerPageIsPresent: true,
			page: 1,
			pageNavIsPresent: true,
			pageInputIsPresent: true
		};
	}

	/**
	 * Component lifecycle hook
	 */
	public ngOnDestroy(): void {
		super.ngOnDestroy();
	}
}
