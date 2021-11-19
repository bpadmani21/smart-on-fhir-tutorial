(function (window) {

   function getUserInfo(client) {
    console.log('executing getUserInfo.');
    
    var ret = $.Deferred();
    function onError() {
      console.log('Loading getUserInfo error', JSON.stringify(arguments));
      ret.reject();
    }

    function queryUser(client) {
      console.log('executing queryUser:' + client.user.id);
      // "user": { "fhirUser": "Practitioner/12742069", "id": "12742069", "resourceType": "Practitioner"
      client.request(`Practitioner/${client.user.id}`, {})
        // Reject if no MedicationRequests are found
        .then(function(data) {
          var res = {}
          res.Practitioner = data
          console.log(res);
          ret.resolve(res);

        }, error =>{
          onError();
        });
      // Current user scope does not support Practioner role
      // console.log("Making attempt to retrieve practioner role: ")
      // client.request("/PractionerRole?practitioner=" + client.user.id, {})
      //   .then(function(data) {
      //     console.log("successfully retireved practioner role record: ")
      //     console.log(data)

      //   });
    }
    
    queryUser(client, onError);
    return ret.promise();

  }


  function getPatientInfo(client) {
    console.log('executing getPatient.');

    var ret = $.Deferred();

    function onError() {
      console.log('Loading patient error', arguments);
      ret.reject();
    }

    function queryPatient(client) {
      console.log('executing queryPatient.');

      // Get current patient,  encounter
      if (client.hasOwnProperty('patient')) {
        console.log("reuesting patient rec for " + client.patient.id)

        //get patient record
        var p1 = client.request(`Patient/${client.patient.id}`, {})
        var p2= client.request(`MedicationOrder?patient=${client.patient.id}`, {})
        var p3 = client.request(`DiagnosticReport?patient=${client.patient.id}`, {})
        var p4 = client.request(`Encounter?patient=${client.patient.id}`, {})

        Promise.all([p1, p2, p3, p4]).then((values) => {
          var res = {}
          res.Patient = values[0]
          res.MedicationOrder = values[1]
          res.DiagnosticReport = values[2]
          res.Encounter = values[3]
          console.log(res);
          ret.resolve(res)
        });
        
        
        // //get patient record
        // client.request(`Patient/${client.patient.id}`, {})
        //   // Reject if no MedicationRequests are found
        //   .then(function(data) {
        //     console.log("successfully retireved patient record: ")
        //     console.log(data)
        //     console.log('resolving patient.');
        //     ret.resolve(data);
        //   })

        //   // patient/MedicationOrder.read
        // client.request(`MedicationOrder?patient=${client.patient.id}`, {})
        //   // Reject if no MedicationRequests are found
        //   .then(function(data) {
        //     console.log("successfully retireved patient medication  record: " + data )
        //     console.log(data)
        //     console.log('resolving patient medication.');
        //     ret.resolve(data);
        //   })
        //   // patient/DiagnosticReport.read 
        // client.request(`DiagnosticReport?patient=${client.patient.id}`, {})
        //   .then(function(data) {
        //     console.log("successfully retireved patient DiagnosticReport  record: " )
        //     console.log(data)
        //     console.log('resolving patient DiagnosticReport.');
        //     //ret.resolve(data);
        //   })
        //   // patient/Encounter.read
        // client.request(`Encounter?patient=${client.patient.id}`, {})
        //   .then(function(data) {
        //     console.log("successfully retireved patient Encounter  record: " )
        //     console.log(data)
        //     console.log('resolving patient Encounter.');
        //     //ret.resolve(data);
        //   })

        } else {
          console.log("throwing error due to missing patient key in clinet")
          onError();
        }




        //   var pt = smart.request(`Patient/${smart.patient.id}`, {});

        //   console.log("made request for patient")

        //   // var patient = smart.patient;
        //   // var pt = patient.read(); 
        //   $.when(pt).fail(onError);
        //   $.when(pt).done(function (patient) {

        //     console.log("successfully retireved patient record: ")
        //     console.log(patient)
        //     // var gender = patient.gender;
        //     // var fname = '';
        //     // var lname = '';

        //     // if (typeof patient.name[0] !== 'undefined') {
        //     //   fname = patient.name[0].given.join(' ');
        //     //   lname = patient.name[0].family.join(' ');
        //     // }
        //     var p = defaultPatient();
        //     // patient data
        //     p.birthdate = patient.birthDate;
        //     p.gender = gender;
        //     p.fname = fname;
        //     p.lname = lname;
        //     console.log('resolving patient.');
        //     ret.resolve(p);
        //   });
        // } else {
        //   onError();
        // }
    }
    
    queryPatient(client, onError);
    return ret.promise();

  }

  window.extractData = function () {
    var ret = $.Deferred();

    function onError() {
      console.log('Loading error on data', arguments);
      ret.reject();
    }

    function onReady(client) {     
      //get practioner record
      var p0 = client.request(`Practitioner/${client.user.id}`, {})
      //get patient record
      var p1 = client.request(`Patient/${client.patient.id}`, {})
      var p2= client.request(`MedicationOrder?patient=${client.patient.id}`, {})
      var p3 = client.request(`DiagnosticReport?patient=${client.patient.id}`, {})
      var p4 = client.request(`Encounter?patient=${client.patient.id}`, {})

      console.log('waiting for promises');
      Promise.all([p0,p1, p2, p3, p4]).then((values) => {
        console.log('Promises resolved');
        var res = {}
        res.practitioner = values[0]
        res.patient = values[1]
        res.medicationOrder = values[2]
        res.diagnosticReport = values[3]
        res.encounter = values[4]
        console.log(res);
        ret.resolve(res)
      });
    }
    FHIR.oauth2.ready(onReady, onError);
    return ret.promise();

  };


  // window.extractData = function() {
  //   var ret = $.Deferred();

  //   function onError() {
  //     console.log('Loading error', arguments);
  //     ret.reject();
  //   }

  //   function getPatient(smart){

  //   }

  //   function onReady(smart)  {
  //     // console.log('executing onReady.');
  //     // console.log(JSON.stringify(smart));
  //     // console.log('executing onReady. Token Response:');
  //     console.log(JSON.stringify(smart.tokenResponse));
  //     console.log("userlink:" + smart.userId)




  //     if (smart.hasOwnProperty('patient')) {
  //       var patient = smart.patient;
  //       var pt = patient.read();

  //       var obv = smart.patient.api.fetchAll({
  //                   type: 'Observation',
  //                   query: {
  //                     code: {
  //                       $or: ['http://loinc.org|8302-2', 'http://loinc.org|8462-4',
  //                             'http://loinc.org|8480-6', 'http://loinc.org|2085-9',
  //                             'http://loinc.org|2089-1', 'http://loinc.org|55284-4']
  //                     }
  //                   }
  //                 });

  //       $.when(pt, obv).fail(onError);


  //       $.when(pt, obv).done(function(patient, obv) {
  //         // console.log('Patient record:'+ JSON.stringify(patient));
  //         // console.log('Patient Observations:'+ JSON.stringify(obv));

  //         var byCodes = smart.byCodes(obv, 'code');
  //         var gender = patient.gender;

  //         var fname = '';
  //         var lname = '';

  //         if (typeof patient.name[0] !== 'undefined') {
  //           fname = patient.name[0].given.join(' ');
  //           lname = patient.name[0].family.join(' ');
  //         }

  //         var height = byCodes('8302-2');
  //         var systolicbp = getBloodPressureValue(byCodes('55284-4'),'8480-6');
  //         var diastolicbp = getBloodPressureValue(byCodes('55284-4'),'8462-4');
  //         var hdl = byCodes('2085-9');
  //         var ldl = byCodes('2089-1');

  //         var p = defaultPatient();
  //         // Practitioner data
  //         p.userid =smart.tokenResponse.user;
  //         p.username =smart.tokenResponse.username;
  //         p.pid =smart.tokenResponse.patient;
  //         p.encounter =smart.tokenResponse.encounter;

  //         // patient data
  //         p.birthdate = patient.birthDate;
  //         p.gender = gender;
  //         p.fname = fname;
  //         p.lname = lname;
  //         p.height = getQuantityValueAndUnit(height[0]);

  //         if (typeof systolicbp != 'undefined')  {
  //           p.systolicbp = systolicbp;
  //         }

  //         if (typeof diastolicbp != 'undefined') {
  //           p.diastolicbp = diastolicbp;
  //         }

  //         p.hdl = getQuantityValueAndUnit(hdl[0]);
  //         p.ldl = getQuantityValueAndUnit(ldl[0]);

  //         ret.resolve(p);
  //       });
  //     } else {
  //       onError();
  //     }
  //   }

  //   FHIR.oauth2.ready(onReady, onError);
  //   return ret.promise();

  // };
  // window.extractPractionerData = function() {
  //   var ret = $.Deferred();
  //   console.log('executing Practitioner data.');
  //   function onError() {
  //     console.log('Loading Practitioner error', arguments);
  //     ret.reject();
  //   }

  //   function onReady(smart)  {
  //     console.log("userlink:" + smart.userId)
  //     if (smart.hasOwnProperty('tokenResponse')) {
  //       var p = defaultPractionerInfo();
  //       p.userid =smart.tokenResponse.user;
  //       p.username =smart.tokenResponse.username;
  //       p.pid =smart.tokenResponse.patient;
  //       p.encounter =smart.tokenResponse.encounter;
  //       ret.resolve(p);


  //       // var patient = smart.patient;
  //       // var pt = patient.read();
  //       // console.log('Patient record:'+ pt);
  //       // var obv = smart.patient.api.fetchAll({
  //       //             type: 'Observation',
  //       //             query: {
  //       //               code: {
  //       //                 $or: ['http://loinc.org|8302-2', 'http://loinc.org|8462-4',
  //       //                       'http://loinc.org|8480-6', 'http://loinc.org|2085-9',
  //       //                       'http://loinc.org|2089-1', 'http://loinc.org|55284-4']
  //       //               }
  //       //             }
  //       //           });

  //       // $.when(pt, obv).fail(onError);
  //       // console.log('Patient Observations:'+ obv);

  //       // $.when(pt, obv).done(function(patient, obv) {
  //       //   var byCodes = smart.byCodes(obv, 'code');
  //       //   var gender = patient.gender;

  //       //   var fname = '';
  //       //   var lname = '';

  //       //   if (typeof patient.name[0] !== 'undefined') {
  //       //     fname = patient.name[0].given.join(' ');
  //       //     lname = patient.name[0].family.join(' ');
  //       //   }

  //       //   var height = byCodes('8302-2');
  //       //   var systolicbp = getBloodPressureValue(byCodes('55284-4'),'8480-6');
  //       //   var diastolicbp = getBloodPressureValue(byCodes('55284-4'),'8462-4');
  //       //   var hdl = byCodes('2085-9');
  //       //   var ldl = byCodes('2089-1');

  //       //   var p = defaultPractionerInfo();
  //       //   ret.resolve(p);
  //       // });
  //     } else {
  //       onError();
  //     }
  //   }

  //   FHIR.oauth2.ready(onReady, onError);
  //   return ret.promise();

  // };

  function defaultPatient() {
    return {

      // Practitioner data
      userid: { value: '' },
      username: { value: '' },
      pid: { value: '' },
      encounter: { value: '' },
      //Patient data
      fname: { value: '' },
      lname: { value: '' },
      gender: { value: '' },
      birthdate: { value: '' },
      height: { value: '' },
      systolicbp: { value: '' },
      diastolicbp: { value: '' },
      ldl: { value: '' },
      hdl: { value: '' },
    };
  }

  function defaultUserInfo() {
    return {
      // Practitioner data
      userid: { value: '' },
      username: { value: '' },
      pid: { value: '' },
      encounter: { value: '' },
    };
  }


  function getBloodPressureValue(BPObservations, typeOfPressure) {
    var formattedBPObservations = [];
    BPObservations.forEach(function (observation) {
      var BP = observation.component.find(function (component) {
        return component.code.coding.find(function (coding) {
          return coding.code == typeOfPressure;
        });
      });
      if (BP) {
        observation.valueQuantity = BP.valueQuantity;
        formattedBPObservations.push(observation);
      }
    });

    return getQuantityValueAndUnit(formattedBPObservations[0]);
  }

  function getQuantityValueAndUnit(ob) {
    if (typeof ob != 'undefined' &&
      typeof ob.valueQuantity != 'undefined' &&
      typeof ob.valueQuantity.value != 'undefined' &&
      typeof ob.valueQuantity.unit != 'undefined') {
      return ob.valueQuantity.value + ' ' + ob.valueQuantity.unit;
    } else {
      return undefined;
    }
  }

  window.drawVisualization = function (res) {
    console.log("drawing values")
    console.log(res)
    //Practitioner data

    $('#practitionRec').html(res.practitioner);
    $('#patientRec').html(res.patient);
    
    $('#userid').html(res.practitioner.id);
    $('#username').html(res.practitioner.name.text);
    $('#pid').html(res.patient.id);
    // $('#encounter').html(p.encounter);
    // //Patient data
    // $('#holder').show();
    // $('#loading').hide();
    // $('#fname').html(p.fname);
    // $('#lname').html(p.lname);
    // $('#gender').html(p.gender);
    // $('#birthdate').html(p.birthdate);
    // $('#height').html(p.height);
    // $('#systolicbp').html(p.systolicbp);
    // $('#diastolicbp').html(p.diastolicbp);
    // $('#ldl').html(p.ldl);
    // $('#hdl').html(p.hdl);
  };

  // window.drawPractitionerInfo = function(p) {
  //   // Practitioner data
  //   $('#userid').html(p.userid);
  //   $('#username').html(p.username);
  //   $('#pid').html(p.pid);
  //   $('#encounter').html(p.encounter);
  // };

})(window);
