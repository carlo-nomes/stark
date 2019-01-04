import { Component, Inject, Input, OnInit } from "@angular/core";
import { StarkSearchFormComponent } from "@nationalbankbelgium/stark-ui";
import { GenericObjectSearchCriteria } from "../entities";
import { FormControl, FormGroup } from "@angular/forms";
import { STARK_LOGGING_SERVICE, StarkLoggingService } from "@nationalbankbelgium/stark-core";
import { DEMO_GENERIC_SERVICE, DemoGenericService } from "../services";
import { take } from "rxjs/operators";

const componentName: string = "demo-generic-search-form";

@Component({
	selector: "demo-generic-search-form",
	templateUrl: "./demo-generic-search-form.component.html"
})
export class DemoGenericSearchFormComponent implements OnInit, StarkSearchFormComponent {
	@Input()
	public searchCriteria: GenericObjectSearchCriteria = <any>{};

	public yearOptions: number[] = [];
	public heroOptions: string[] = [];
	public movieOptions: string[] = [];

	public searchForm: FormGroup;

	public constructor(
		@Inject(STARK_LOGGING_SERVICE) private logger: StarkLoggingService,
		@Inject(DEMO_GENERIC_SERVICE) private genericService: DemoGenericService
	) {}

	public ngOnInit(): void {
		this.searchForm = new FormGroup({
			year: new FormControl(this.searchCriteria.year),
			hero: new FormControl(this.searchCriteria.hero),
			movie: new FormControl(this.searchCriteria.movie)
		});

		this.genericService
			.getHeroes()
			.pipe(take(1))
			.subscribe((heroes: string[]) => (this.heroOptions = heroes));
		this.genericService
			.getYears()
			.pipe(take(1))
			.subscribe((years: number[]) => (this.yearOptions = years));
		this.genericService
			.getMovies()
			.pipe(take(1))
			.subscribe((movies: string[]) => (this.movieOptions = movies));

		this.logger.debug(componentName + " is initialized");
	}

	/**
	 * @ignore
	 */
	public trackItemFn(item: string): string {
		return item;
	}
}
