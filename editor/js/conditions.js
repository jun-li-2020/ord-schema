/**
 * Copyright 2020 Open Reaction Database Project Authors
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *      http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

goog.provide('ord.conditions');

goog.require('ord.electro');
goog.require('ord.flows');
goog.require('ord.illumination');
goog.require('ord.pressure');
goog.require('ord.stirring');
goog.require('ord.temperature');
goog.require('proto.ord.ReactionConditions');

ord.conditions.load = function (conditions) {
  const temperature = conditions.getTemperature();
  if (temperature) {
    ord.temperature.load(temperature);
  }
  const pressure = conditions.getPressure();
  if (pressure) {
    ord.pressure.load(pressure);
  }
  const stirring = conditions.getStirring();
  if (stirring) {
    ord.stirring.load(stirring);
  }
  const illumination = conditions.getIllumination();
  if (illumination) {
    ord.illumination.load(illumination);
  }
  else {
    // If no illumination present, collapse by default.
    const illuminationLegend = $('#section_conditions_illumination').children('legend');
    toggleSlowly(illuminationLegend);
  }
  const electro = conditions.getElectrochemistry();
  if (electro) {
    ord.electro.load(electro);
  }
  else {
    // If no electro present, collapse by default.
    const electroLegend = $('#section_conditions_electro').children('legend');
    toggleSlowly(electroLegend);
  }
  const flow = conditions.getFlow();
  if (flow) {
    ord.flows.load(flow);
  }
  else {
    // If no flow present, collapse by default.
    const flowLegend = $('#section_conditions_flow').children('legend');
    toggleSlowly(flowLegend);
  }
  const reflux = conditions.hasReflux() ? conditions.getReflux() : null;
  setOptionalBool($('#condition_reflux'), reflux);
  if (conditions.hasPh()) {
    $('#condition_ph').text(conditions.getPh());
  }
  const dynamic = conditions.hasConditionsAreDynamic() ?
      conditions.getConditionsAreDynamic() : null;
  setOptionalBool($('#condition_dynamic'), dynamic);
  $('#condition_details').text(conditions.getDetails());
};

ord.conditions.unload = function () {
  const conditions = new proto.ord.ReactionConditions();
  const temperature = ord.temperature.unload();
  conditions.setTemperature(temperature);
  const pressure = ord.pressure.unload();
  conditions.setPressure(pressure);
  const stirring = ord.stirring.unload();
  conditions.setStirring(stirring);
  const illumination = ord.illumination.unload();
  conditions.setIllumination(illumination);
  const electro = ord.electro.unload();
  conditions.setElectrochemistry(electro);
  const flow = ord.flows.unload();
  conditions.setFlow(flow);
  const reflux = getOptionalBool($('#condition_reflux'));
  conditions.setReflux(reflux);
  const ph = parseFloat($('#condition_ph').text());
  if (!isNaN(ph)) {
    conditions.setPh(ph);
  }
  const dynamic = getOptionalBool($('#condition_dynamic'));
  conditions.setConditionsAreDynamic(dynamic);
  const details = $('#condition_details').text();
  conditions.setDetails(details);
  return conditions;
};

ord.conditions.validateConditions = function(node, validateNode) {
  const condition = ord.conditions.unload();
  if (typeof validateNode === 'undefined') {
    validateNode = $('.validate', node).first();
  }
  validate(condition, "ReactionConditions", validateNode);
};