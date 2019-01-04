import { GenericObjectSearchCriteria } from "../entities/generic-object-search.entity";
import { GenericObject } from "../entities/generic-object.entity";
import { StarkGenericSearchService } from "@nationalbankbelgium/stark-ui";
import { InjectionToken } from "@angular/core";
import {Observable} from "rxjs";

export const demoGenericServiceName: string = "DemoGenericService";
export const DEMO_GENERIC_SERVICE: InjectionToken<DemoGenericService> = new InjectionToken<DemoGenericService>(demoGenericServiceName);

export interface DemoGenericService extends StarkGenericSearchService<GenericObject, GenericObjectSearchCriteria> {
	getYears(): Observable<number[]>;
	
	getMovies(): Observable<string[]>;
	
	getHeroes(): Observable<string[]>;
}
