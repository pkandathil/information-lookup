{
    "configurationSettings":[{
        "category":"General Settings",

        "fields":[
        {
            "type": "webmap",
            "label": "Select a map"
        }, 
        {
            "type":"string",
            "fieldName":"serviceAreaLayerNames",
            "label":"Lookup Layers",
            "tooltip":"Polygon Layers used for service lookup delimited by a vertical bar"
        },
        {
            "type":"string",
            "fieldName":"popupTitle", 
            "label": "Popup Title",
            "tooltip": "Popup title when service information is available"
        },
        {
            "type":"string",
            "fieldName":"serviceUnavailableTitle",
            "label":"Unavailable Popup Title:",
            "tooltip":"Popup title when outside an area"
        },
        {
            "type":"string",
            "fieldName":"serviceUnavailableMessage",
            "label":"Unavailable Popup Message",
            "tooltip":"Popup message when outside an area",
            "stringFieldOption": "richtext"
        },
       {
           "label": "Zoom level for location",
           "fieldName": "zoomLevel",
           "type": "number",
           "constraints": {"min": 0, "places": 0},
           "tooltip": "Sets the map zoom level to this level after location is entered"
       },
        {
            "type": "boolean",
            "fieldName": "storeLocation",
            "label": "Store location",
            "tooltip": "Check this to store the location in a layer in the webmap"
        },
        {
            "type":"layerAndFieldSelector",
            "fields":[ 
                    {
                        "supportedTypes": ["esriFieldTypeString"],
                        "multipleSelection": false,
                        "fieldName": "serviceRequestLayerAvailibiltyField",
                        "label": "Field used to store the Yes or No value",
                        "tooltip":"Field used to store the Yes or No value"

                    }
            ],
            "layerOptions":{
                "supportedTypes":[
                    "FeatureLayer"
                ],      
                "geometryTypes":[
                    "esriGeometryPoint"
                ]
            },
            "fieldName":"serviceRequestLayerName",
            "label":"Storage Layer Name",
            "tooltip":"Point layer used for to store request locations"
        },

        {
            "type":"string",
            "fieldName":"serviceRequestLayerAvailibiltyFieldValueAvail",
            "label":"Yes value",
            "tooltip":"Value to set when the request location intersects a lookup feature",
            "stringFieldOption": "text"
        },{
            "type":"string",
            "fieldName":"serviceRequestLayerAvailibiltyFieldValueNotAvail",
            "label":"No value",
            "tooltip":"Value to set when the request location does not intersects a lookup feature",
            "stringFieldOption": "text"
        },
        {
            "type": "boolean",
            "fieldName": "showSplash",
            "label": "Display Splash Screen on Startup",
            "tooltip": "Check on if you want to display a splash screen at startup"
        },
         {
             "type":"string",
             "fieldName":"splashText",
             "label":"Splash Screen message",
             "tooltip":"Message to display when application is loaded",
             "stringFieldOption": "richtext"
         }
        ]
    }],
    "values":{
        "serviceAreaLayerNames": "Service Area",
        "popupTitle": "Service Information",
        "serviceUnavailableTitle": "Outside Utility Service Area",
        "serviceUnavailableMessage": "The utility does not provide service to the selected location",
        "zoomLevel": 16,
        "storeLocation": false,
        "serviceRequestLayerAvailibiltyFieldValueAvail": "Intersected",
        "serviceRequestLayerAvailibiltyFieldValueNotAvail": "Not Intersected",
        "splashText":"<center>Information Lookup is a configurable web application template that can be used to provide the general public, internal staff and other interested parties the with information about a location. If no features are found at that location, a general message is displayed. Optionally, the location entered can be stored in a point layer. The template can be configured using the ArcGIS Online Configuration dialog.</center>"

        

    }
}