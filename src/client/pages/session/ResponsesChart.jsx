import React from 'react';
import size from 'lodash/size';
import { withStyles } from 'material-ui/styles';
import NVD3Chart from 'react-nvd3';
import getChartData from './get-chart-data';

const styles = theme => ({
  root: {
    '& svg': {
      height: 300,
      width: '100%',
    },
    'marginTop': theme.spacing.unit * 2,
  },
});

export const RawResponsesChart = ({
  responses,
  classes,
}) => {
  const chartData = getChartData(responses);
  const datum = [{
    key: 'Title',
    values: chartData,
  }];
  return (
    <div className={classes.root}>
      {
        size(responses) > 0 &&
        <NVD3Chart id={'barChart'} type={'discreteBarChart'} datum={datum} x={'label'} y={'value'} />
      }
    </div>
  );
};
export default withStyles(styles)(RawResponsesChart);
