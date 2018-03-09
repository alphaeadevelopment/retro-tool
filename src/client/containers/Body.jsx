import React from 'react';
import { Route } from 'react-router-dom';
import { ProjectHome, Welcome, BudgetSummary, StaticData } from '../pages';
import * as Paths from '../paths';
import Logout from './Logout';
import styles from './Body.scss';

export default () => (
  <div className={styles.body}>
    <Route path={Paths.Welcome} exact component={Welcome} />
    <Route path={Paths.ProjectHome} component={ProjectHome} />
    <Route path={Paths.BudgetSummary} component={BudgetSummary} />
    <Route path={Paths.StaticData} component={StaticData} />
    <Route path={Paths.Logout} component={Logout} />
  </div>
);
