import { embed } from '@nebula.js/stardust';

import bar from '@nebula.js/sn-bar-chart';
import line from '@nebula.js/sn-line-chart';
import scatter from '@nebula.js/sn-scatter-plot';
import kpi from '@nebula.js/sn-kpi';
import boxplot from '@nebula.js/sn-boxplot';
import bullet from '@nebula.js/sn-bullet-chart';
import combo from '@nebula.js/sn-combo-chart';
import distributionplot from '@nebula.js/sn-distributionplot';
import funnel from '@nebula.js/sn-funnel-chart';
import grid from '@nebula.js/sn-grid-chart';
import table from '@nebula.js/sn-table';

const charts = {bar, line, scatter, kpi, boxplot, bullet, combo, distributionplot, funnel, grid, table};

const clientNames = {
  bar: 'barchart', // @nebula.js/sn-bar-chart
  boxplot: 'boxplot', // @nebula.js/sn-boxplot
  bullet: 'bulletchart', // @nebula.js/sn-bullet-chart
  combo: 'combochart', // @nebula.js/sn-combo-chart
  distributionplot: 'distributionplot', // @nebula.js/sn-distributionplot
  funnel: 'qlik-funnel-chart', // @nebula.js/sn-funnel-chart
  grid: 'sn-grid-chart', // @nebula.js/sn-grid-chart
  histogram: 'histogram', // @nebula.js/sn-histogram
  kpi: 'kpi', // @nebula.js/sn-kpi
  line: 'linechart', // @nebula.js/sn-line-chart
  mekko: 'mekkochart', // @nebula.js/sn-mekko-chart
  org: 'sn-org-chart', // @nebula.js/sn-org-chart
  pie: 'piechart', // @nebula.js/sn-pie-chart
  pivot: 'pivot-table', // @nebula.js/sn-pivot-table
  sankey: 'qlik-sankey-chart-ext', // @nebula.js/sn-sankey-chart
  scatter: 'scatterplot', // @nebula.js/sn-scatter-plot
  table: 'table', // @nebula.js/sn-table
  video: 'sn-video-player', // @nebula.js/sn-video-player
  waterfall: 'waterfallchart', // @nebula.js/sn-waterfall
};

const types = ["bar", "line", "scatter","kpi","boxplot","bullet","combo","distributionplot","funnel","grid","mekko","pie","pivot","sankey","table","waterfall"].map((t) => ({
  name: clientNames[t],
  load: () => charts[t],
}));

const embedConfig = embed.createConfiguration({
  context: {
    theme: 'light',
    language: 'en-US',
  },
  types
});

export {embedConfig, clientNames};
