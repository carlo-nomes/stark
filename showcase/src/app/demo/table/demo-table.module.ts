import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TranslateModule } from "@ngx-translate/core";
import { StarkActionBarModule, StarkTableModule } from "@nationalbankbelgium/stark-ui";
import { SharedModule } from "../../shared";
import { DemoTableComponent } from "./demo-table.component";
import { TableRegularComponent } from "./table-regular/table-regular.component";
import { TableWithCustomActionsComponent } from "./table-with-custom-actions/table-with-custom-actions.component";

@NgModule({
	imports: [CommonModule, TranslateModule, StarkTableModule, StarkActionBarModule, SharedModule],
	declarations: [DemoTableComponent, TableRegularComponent, TableWithCustomActionsComponent],
	exports: [DemoTableComponent]
})
export class DemoTableModule {}
