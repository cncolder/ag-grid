import {
    AgColorPicker,
    AgGroupComponent,
    AgSlider,
    Component,
    PostConstruct,
    RefSelector
} from "ag-grid-community";
import { ChartController } from "../../../chartController";
import { CartesianChart } from "../../../../../charts/chart/cartesianChart";

export class AxisTicksPanel extends Component {

    public static TEMPLATE =
        `<div>         
            <ag-group-component ref="axisTicksGroup">
                <ag-color-picker ref="axisTicksColorPicker"></ag-color-picker>
                <ag-slider ref="axisTicksWidthSlider"></ag-slider>
                <ag-slider ref="axisTicksSizeSlider"></ag-slider>
                <ag-slider ref="axisTicksPaddingSlider"></ag-slider>
            </ag-group-component>
        </div>`;

    @RefSelector('axisTicksGroup') private axisTicksGroup: AgGroupComponent;
    @RefSelector('axisTicksColorPicker') private axisTicksColorPicker: AgColorPicker;
    @RefSelector('axisTicksWidthSlider') private axisTicksWidthSlider: AgSlider;
    @RefSelector('axisTicksSizeSlider') private axisTicksSizeSlider: AgSlider;
    @RefSelector('axisTicksPaddingSlider') private axisTicksPaddingSlider: AgSlider;

    private readonly chartController: ChartController;
    private chart: CartesianChart;

    constructor(chartController: ChartController) {
        super();
        this.chartController = chartController;
    }

    @PostConstruct
    private init() {
        this.setTemplate(AxisTicksPanel.TEMPLATE);

        const chartProxy = this.chartController.getChartProxy();
        this.chart = chartProxy.getChart() as CartesianChart;

        this.initAxisTicks();
    }

    private initAxisTicks() {
        this.axisTicksGroup
            .setTitle('Ticks')
            .hideOpenCloseIcons(true)
            .hideEnabledCheckbox(true);

        this.axisTicksColorPicker
            .setLabel("Color")
            .setLabelWidth('flex')
            .setWidth(115)
            .setValue(`${this.chart.xAxis.lineColor}`)
            .onColorChange(newColor => {
                this.chart.xAxis.tickColor = newColor;
                this.chart.yAxis.tickColor = newColor;
                this.chart.performLayout();
            });

        type AxisTickProperty = 'tickWidth' | 'tickSize' | 'tickPadding';

        const initInput = (property: AxisTickProperty, input: AgSlider, label: string, initialValue: string, maxValue: number) => {
            input.setLabel(label)
                .setValue(initialValue)
                .setMaxValue(maxValue)
                .onInputChange(newValue => {
                    this.chart.xAxis[property] = newValue;
                    this.chart.yAxis[property] = newValue;
                    this.chart.performLayout();
                });
        };

        const initialWidth = `${this.chart.xAxis.tickWidth}`;
        initInput('tickWidth', this.axisTicksWidthSlider, 'Width', initialWidth, 10);

        const initialLength = `${this.chart.xAxis.tickSize}`;
        initInput('tickSize', this.axisTicksSizeSlider, 'Length', initialLength, 30);

        const initialPadding = `${this.chart.xAxis.tickPadding}`;
        initInput('tickPadding', this.axisTicksPaddingSlider, 'Padding', initialPadding, 30);
    }

    public destroy(): void {
        super.destroy();
    }
}