// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import './main.js';
import './chii_app-meta-files.js';

import * as Main from '../main/main.js';
import * as Startup from '../startup/startup.js';
import '../../panels/screencast/screencast-meta.js';

new Main.MainImpl.MainImpl();
Startup.RuntimeInstantiator.startApplication('devtools_app');
