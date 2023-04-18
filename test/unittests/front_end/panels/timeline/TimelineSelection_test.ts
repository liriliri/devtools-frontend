// Copyright 2023 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

import * as TimelineModel from '../../../../../front_end/models/timeline_model/timeline_model.js';
import * as Timeline from '../../../../../front_end/panels/timeline/timeline.js';
import {describeWithEnvironment} from '../../helpers/EnvironmentHelpers.js';
import {allModelsFromFile, getAllTracingModelPayloadEvents} from '../../helpers/TraceHelpers.js';

const {assert} = chai;

describeWithEnvironment('TimelineSelection', () => {
  it('can be created with a frame', () => {
    const frame = new TimelineModel.TimelineFrameModel.TimelineFrame(1, 0);
    const selection = Timeline.TimelineSelection.TimelineSelection.fromFrame(frame);
    assert.strictEqual(selection.type(), Timeline.TimelineSelection.SelectionType.Frame);
    assert.strictEqual(selection.object(), frame);
    assert.strictEqual(selection.startTime(), frame.startTime);
    assert.strictEqual(selection.endTime(), frame.endTime);
  });

  it('can be created with a network request', async () => {
    const data = await allModelsFromFile('web-dev.json.gz');
    // Does not matter which network request, just grab the first send request.
    const firstNetworkEvent = getAllTracingModelPayloadEvents(data.tracingModel).find(event => {
      return event.name === TimelineModel.TimelineModel.RecordType.ResourceSendRequest;
    });
    if (!firstNetworkEvent) {
      throw new Error('Could not find network event');
    }
    const request = new TimelineModel.TimelineModel.NetworkRequest(firstNetworkEvent);
    const selection = Timeline.TimelineSelection.TimelineSelection.fromNetworkRequest(request);
    assert.strictEqual(selection.type(), Timeline.TimelineSelection.SelectionType.NetworkRequest);
    assert.strictEqual(selection.object(), request);
    assert.strictEqual(selection.startTime(), request.startTime);
    assert.strictEqual(selection.endTime(), request.endTime);
  });

  it('can be created with an SDK trace event', async () => {
    const data = await allModelsFromFile('web-dev.json.gz');
    const firstLCPEvent = getAllTracingModelPayloadEvents(data.tracingModel).find(event => {
      return event.name === TimelineModel.TimelineModel.RecordType.MarkLCPCandidate;
    });
    if (!firstLCPEvent) {
      throw new Error('Could not find LCP event');
    }
    const selection = Timeline.TimelineSelection.TimelineSelection.fromSDKTraceEvent(firstLCPEvent);
    assert.strictEqual(selection.type(), Timeline.TimelineSelection.SelectionType.SDKTraceEvent);
    assert.strictEqual(selection.object(), firstLCPEvent);
    assert.strictEqual(selection.startTime(), firstLCPEvent.startTime);
    // No end time, so the end time gets set to the start time.
    assert.strictEqual(selection.endTime(), firstLCPEvent.startTime);
  });

  it('can be created with a range', async () => {
    const selection = Timeline.TimelineSelection.TimelineSelection.fromRange(0, 10);
    assert.strictEqual(selection.type(), Timeline.TimelineSelection.SelectionType.Range);
    assert.isNull(selection.object());
    assert.strictEqual(selection.startTime(), 0);
    assert.strictEqual(selection.endTime(), 10);
  });
});
