
$(document).ready(function () {
    initializeForm();
});

function initializeForm() {
    disableFormFields(true);
    disableButtons();
    $("#rollNo").prop("disabled", false).val("").focus();
    $("#fullName").val("");
    $("#class").val("");
    $("#birthDate").val("");
    $("#address").val("");
    $("#enrollDate").val("");

    $("#rollNo").off("blur").on("blur", function () {
        if ($("#rollNo").val() !== "") {
            checkStudentExists();
        }
    });
}

function disableFormFields(disabled) {
    $("#fullName, #class, #birthDate, #address, #enrollDate").prop("disabled", disabled);
}

function disableButtons() {
    $("#saveBtn, #changeBtn, #resetBtn").prop("disabled", true);
}

function checkStudentExists() {
    var rollNo = $("#rollNo").val();
    var jsonStr = {id: rollNo};
    var jsonStrObj = JSON.stringify(jsonStr);

    var getRequest = createGETRequest("90934774|-31949209008006918|90955994", jsonStrObj, "SCHOOL-DB", "STUDENT-TABLE");

    jQuery.ajaxSetup({async: false});
    var resultObj = executeCommandAtGivenBaseUrl(getRequest, "http://api.login2explore.com:5577", "/api/irl");
    jQuery.ajaxSetup({async: true});

    if (resultObj.status === 200) {
        var data = JSON.parse(resultObj.data).record;
        populateForm(data);
        $("#rollNo").prop("disabled", true);
        disableFormFields(false);
        $("#saveBtn").prop("disabled", true);
        $("#changeBtn").prop("disabled", false);
        $("#resetBtn").prop("disabled", false);
        $("#fullName").focus();
    } else {
        clearFormExceptId();
        disableFormFields(false);
        $("#saveBtn").prop("disabled", false);
        $("#changeBtn").prop("disabled", true);
        $("#resetBtn").prop("disabled", false);
        $("#fullName").focus();
    }
}

function clearFormExceptId() {
    $("#fullName, #class, #birthDate, #address, #enrollDate").val("");
}

function populateForm(data) {
    $("#fullName").val(data.fullName);
    $("#class").val(data.class);
    $("#birthDate").val(data.birthDate);
    $("#address").val(data.address);
    $("#enrollDate").val(data.enrollDate);
}

function validateAndGetFormData() {
    var rollNo = $("#rollNo").val();
    if (rollNo === "") {
        alert("Roll No is Required");
        $("#rollNo").focus();
        return "";
    }

    var fullName = $("#fullName").val();
    if (fullName === "") {
        alert("Full Name is Required");
        $("#fullName").focus();
        return "";
    }

    var classVal = $("#class").val();
    if (classVal === "") {
        alert("Class is Required");
        $("#class").focus();
        return "";
    }

    var birthDate = $("#birthDate").val();
    if (birthDate === "") {
        alert("Birth Date is Required");
        $("#birthDate").focus();
        return "";
    }

    var address = $("#address").val();
    if (address === "") {
        alert("Address is Required");
        $("#address").focus();
        return "";
    }

    var enrollDate = $("#enrollDate").val();
    if (enrollDate === "") {
        alert("Enrollment Date is Required");
        $("#enrollDate").focus();
        return "";
    }

    var jsonStrObj = {
        id: rollNo,
        fullName: fullName,
        class: classVal,
        birthDate: birthDate,
        address: address,
        enrollDate: enrollDate
    };

    return JSON.stringify(jsonStrObj);
}

function createPUTRequest(connToken, jsonObj, dbName, relName) {
    return JSON.stringify({
        token: connToken,
        dbName: dbName,
        cmd: "PUT",
        rel: relName,
        jsonStr: JSON.parse(jsonObj)
    });
}

function createGETRequest(connToken, jsonObj, dbName, relName) {
    return JSON.stringify({
        token: connToken,
        dbName: dbName,
        cmd: "GET",
        rel: relName,
        jsonStr: JSON.parse(jsonObj)
    });
}

function createUPDATERequest(connToken, jsonObj, dbName, relName) {
    return JSON.stringify({
        token: connToken,
        dbName: dbName,
        cmd: "UPDATE",
        rel: relName,
        jsonStr: JSON.parse(jsonObj)
    });
}

function executeCommandAtGivenBaseUrl(reqString, dbBaseUrl, apiEndPointUrl) {
    var url = dbBaseUrl + apiEndPointUrl;
    var jsonObj;
    jQuery.ajaxSetup({async: false});
    $.post(url, reqString, function (result) {
        jsonObj = JSON.parse(result);
    }).fail(function (result) {
        var dataJsonObj = result.responseText;
        jsonObj = JSON.parse(dataJsonObj);
    });
    jQuery.ajaxSetup({async: true});
    return jsonObj;
}

function resetForm() {
    initializeForm();
}

function saveStudent() {
    var jsonStr = validateAndGetFormData();
    if (jsonStr === "")
        return;

    var putReqStr = createPUTRequest("90934774|-31949209008006918|90955994", jsonStr, "SCHOOL-DB", "STUDENT-TABLE");
    jQuery.ajaxSetup({async: false});
    var resultObj = executeCommandAtGivenBaseUrl(putReqStr, "http://api.login2explore.com:5577", "/api/iml");
    jQuery.ajaxSetup({async: true});

    alert("Student record saved successfully!");
    resetForm();
}

function changeStudent() {
    var jsonStr = validateAndGetFormData();
    if (jsonStr === "")
        return;

    var updateReqStr = createUPDATERequest("90934774|-31949209008006918|90955994", jsonStr, "SCHOOL-DB", "STUDENT-TABLE");
    jQuery.ajaxSetup({async: false});
    var resultObj = executeCommandAtGivenBaseUrl(updateReqStr, "http://api.login2explore.com:5577", "/api/iml");
    jQuery.ajaxSetup({async: true});

    alert("Student record updated successfully!");
    resetForm();
}

