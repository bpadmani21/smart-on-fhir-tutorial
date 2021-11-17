(function (window) {

  /***
   * 
   * 
   function display(data) {
        const output = document.getElementById("output");
        output.innerText = data instanceof Error ?
            String(data) :
            JSON.stringify(data, null, 4);
    }

    const client = new FHIR.client({
        serverUrl: "https://r3.smarthealthit.org",
        tokenResponse: {
            patient: "2e27c71e-30c8-4ceb-8c1c-5641e066c0a4"
        }
    });

    client.request(`Patient/${client.patient.id}`)
        .then(display)
        .catch(display);
   * 
   */

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
          console.log("successfully retireved practioner record: ")
          console.log(data)
          console.log('resolving user.');
          ret.resolve(data);

        }, error =>{
          onError();
        });
      console.log("Making attempt to retrieve practioner role: ")
      client.request("/PractionerRole?practitioner=" + client.user.id, {})
        .then(function(data) {
          console.log("successfully retireved practioner role record: ")
          console.log(data)

        });
    }
    
    queryUser(client, onError);
    return ret.promise();

  }


  function getPatient(client) {
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
        client.request(`Patient/${client.patient.id}`, {})
          // Reject if no MedicationRequests are found
          .then(function(data) {
            console.log("successfully retireved patient record: ")
            console.log(data)
            console.log('resolving patient.');
            ret.resolve(data);

          })
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
      console.log('executing onReady.');
      console.log(client);
      console.log('Getting objects');
      
      var userInfo = getUserInfo (client)
      var patient = getPatient(client)

      console.log('waiting for promises');

      $.when(userInfo, patient).fail(onError);
      $.when(userInfo, patient).done(function (userInfo, patient) {
        console.log('Promises resolved');
        ret.resolve(patient);
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

  window.drawVisualization = function (p) {
    //Practitioner data
    $('#userid').html(p.userid);
    $('#username').html(p.username);
    $('#pid').html(p.pid);
    $('#encounter').html(p.encounter);
    //Patient data
    $('#holder').show();
    $('#loading').hide();
    $('#fname').html(p.fname);
    $('#lname').html(p.lname);
    $('#gender').html(p.gender);
    $('#birthdate').html(p.birthdate);
    $('#height').html(p.height);
    $('#systolicbp').html(p.systolicbp);
    $('#diastolicbp').html(p.diastolicbp);
    $('#ldl').html(p.ldl);
    $('#hdl').html(p.hdl);
  };

  // window.drawPractitionerInfo = function(p) {
  //   // Practitioner data
  //   $('#userid').html(p.userid);
  //   $('#username').html(p.username);
  //   $('#pid').html(p.pid);
  //   $('#encounter').html(p.encounter);
  // };

})(window);
