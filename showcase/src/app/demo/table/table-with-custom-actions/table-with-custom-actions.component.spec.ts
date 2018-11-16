import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { TableWithCustomActionsComponent } from "./table-with-custom-actions.component";

describe("TableWithCustomActionsComponent", () => {
	let component: TableWithCustomActionsComponent;
	let fixture: ComponentFixture<TableWithCustomActionsComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [TableWithCustomActionsComponent]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(TableWithCustomActionsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
