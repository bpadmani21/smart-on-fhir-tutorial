(function (window) {

   window.extractData = function () {
    var ret = $.Deferred();
    function onError() {
      console.log('Loading error on data', arguments);
      ret.reject();
    }

    function onReady(client) { 
      console.log("SmartClinet is ready.")
      console.log(client)    
      //get practioner record
      var p0 = client.request(`Practitioner/${client.user.id}`, {})
      //get patient record
      var p1 = client.request(`Patient/${client.patient.id}`, {})
      var p2= client.request(`MedicationOrder?patient=${client.patient.id}`, {})
      var p3 = client.request(`DiagnosticReport?patient=${client.patient.id}`, {})
      var p4 = client.request(`Encounter?patient=${client.patient.id}`, {})
      var p5 = client.request(`Observation?patient=${client.patient.id}`, {})

      console.log('waiting for promises');
      Promise.all([p0,p1, p2, p3, p4, p5]).then((values) => {
        console.log('Promises resolved');
        var res = {}
        res.practitioner = values[0]
        res.patient = values[1]
        res.medicationOrders = values[2]
        res.diagnosticReports = values[3]
        res.encounters = values[4]
        res.observations = values[5]
        console.log(res);
        ret.resolve(res)
      });
    }
    FHIR.oauth2.ready(onReady, onError);
    return ret.promise();
  };


  window.drawVisualization = function (res) {
    console.log("drawing values")
    $('#proactitioner').html(res.practitioner.text.div);
    $('#patient').html(res.patient.text.div);
    $('#medicationOrder').html("<b>Medications<br/>Total:</b>" + res.medicationOrders.link.length);
    $('#diagnosticReport').html("<b>Diagnostics<br/>Total:</b>"+ res.diagnosticReports.link.length);
    $('#encounter').html("<b>Encounters<br/>Total:</b>"+ res.encounters.link.length);
    $('#observation').html("<b>Observations<br/>Total:</b>"+ res.observations.link.length);

    $('#practitionRec').text(JSON.stringify(res.practitioner,null,'\t'));
    $('#patientRec').text(JSON.stringify(res.patient,null,'\t'));
    $('#medicationOrderRec').text(JSON.stringify(res.medicationOrders,null,'\t'));
    $('#diagnosticReportRec').text(JSON.stringify(res.diagnosticReports,null,'\t'));
    $('#encounterRec').text(JSON.stringify(res.encounters,null,'\t'));
    $('#observationRec').text(JSON.stringify(res.observations,null,'\t'));

    $('#holder').show();
    $('#loading').hide();
  };

})(window);
