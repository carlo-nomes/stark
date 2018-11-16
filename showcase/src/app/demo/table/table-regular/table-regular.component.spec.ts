import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { TableRegularComponent } from "./table-regular.component";

describe("TableRegularComponent", () => {
	let component: TableRegularComponent;
	let fixture: ComponentFixture<TableRegularComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [TableRegularComponent]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(TableRegularComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
