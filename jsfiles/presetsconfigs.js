function Getconfig() {
    let sel = document.getElementById("configs");
    $.post("https://photosynthesynth.herokuapp.com/getconfig/", {
            USERID: "2343523"
        },
        function(data, status) {
            if (data.status == 200) {
                setthis(JSON.parse(data.data[0].JSONDATASTRING));
                let index = 0;
                console.log(data.data);
                data.data.forEach(element => {
                    var opt = document.createElement('option');
                    opt.appendChild(document.createTextNode(element.CONFIGNAME + " " + element.TMSTAMP.substring(0, 10) + " " + element.TMSTAMP.substring(11, 16)));
                    var value = JSON.parse(element.JSONDATASTRING);
                    var indexs = {
                        "index": index,
                        "ID": element.ID
                    };
                    $.extend(value, indexs);
                    opt.value = JSON.stringify(value);


                    sel.appendChild(opt);
                });
            } else {
                var opt = document.createElement('option');
                opt.appendChild(document.createTextNode("Create New"));
                sel.appendChild(opt);
            }
        })
}


function UpdateConfigData() {

    $.post("https://photosynthesynth.herokuapp.com/updateconfig/", {
            ID: GetSelectedConfig().ID,
            JSONDATA: JSON.stringify(getthis())
        },
        function(data, status) {
            if (data.status == 200) {
                document.getElementById("SaveIcon").style.display = "none";
                Getconfig()
            }
        })
}

function DeleteConfigData() {
    // consil
    $.ajax({
        type: "PUT",
        url: "https://photosynthesynth.herokuapp.com/deleteconfig/",
        dataType: "text",
        data: {
            CONFIG: GetSelectedConfig().ID

        },

        success: function(response) {
            //if request if made successfully then the response represent the data
            ClearConfigList()
            Getconfig()
        }
    });
}

function NewConfigData(name) {
    // consil
    $.ajax({
        type: "PUT",
        url: "https://photosynthesynth.herokuapp.com/addconfig/",
        dataType: "text",
        data: {
            USERID: 2343523,
            CONFIGNAME: name,
            JSONDATA: JSON.stringify(getthis())
        },
        success: function(response) {
            //if request if made successfully then the response represent the data
            ClearConfigList()
            Getconfig()
            alert("preset saved")
        }
    });
}

function ClearConfigList() {
    let selectElement = document.getElementById("configs");
    var i, L = selectElement.options.length - 1;
    for (i = L; i >= 0; i--) {
        selectElement.remove(i);
    }
}



function SetConfigName() {
    var presetname = prompt("Give You Preset A Name");
    if (presetname == null || presetname == "" || presetname.length > 50) {
        alert("preset not saved");
    } else {
        NewConfigData(presetname);

    }
}




window.onload = function() {
    Getconfig()
};