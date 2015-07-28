/*global define,document */
/*jslint sloppy:true,nomen:true */
/*
 | Copyright 2014 Esri
 |
 | Licensed under the Apache License, Version 2.0 (the "License");
 | you may not use this file except in compliance with the License.
 | You may obtain a copy of the License at
 |
 |    http://www.apache.org/licenses/LICENSE-2.0
 |
 | Unless required by applicable law or agreed to in writing, software
 | distributed under the License is distributed on an "AS IS" BASIS,
 | WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 | See the License for the specific language governing permissions and
 | limitations under the License.
 */
define([
    "dojo",
    "dojo/ready",
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/Deferred",
    "esri/arcgis/utils",
    "dojo/dom",
    "dojo/dom-class",
    "dojo/on",
    "dojo/topic",
    "application/splashscreen",
    "application/basemapButton",
    "application/navigationButtons",
    "application/combinedPopup",
    "application/search",
     "application/drawer",
    "dojo/domReady!"
],
function (
    dojo,
    ready,
    declare,
    lang,
    Deferred,
    arcgisUtils,
    dom,
    domClass,
    on,
    topic,
    SplashScreen,
    BasemapButton,
    NavigationButtons,
    CombinedPopup,
    Search,
    Drawer
) {
  return declare(null, {
    config: {},
    startup: function (config) {
      var promise;
      // config will contain application and user defined info for the template such as i18n strings, the web map id
      // and application id
      // any url parameters and any application specific configuration information.
      this._toggleIndicatorListener = topic.subscribe("app\toggleIndicator", this._toggleIndicator);
      this._errorListener = topic.subscribe("app\error", this.reportError);
      //topic.subscribe("app/mapLocate", lang.hitch(this, this._mapLocate));

      if (config) {
        this.config = config;
        var itemInfo = this.config.itemInfo || this.config.webmap;

        this._drawer = new Drawer({
          showDrawerSize: 850, // Pixel size when the drawer is automatically opened
          borderContainer: "border_container", // border container node id
          contentPaneCenter: "cp_center", // center content pane node id
          contentPaneSide: "cp_left", // side content pane id
          toggleButton: "toggle_button", // button node to toggle drawer id
          topBar: "top_bar",// top bar id
          direction: "ltr", // i18n direction "ltr" or "rtl"
          theme:"white"
        });
        on(this._drawer, "load", lang.hitch(this, this._initDrawer));

        // startup drawer
        this._drawer.startup();
    
       this._checkEditing();
        try {

          this.config = config;

          document.title = this.config.i18n.page.title;

          if (this.config.showSplash) {
            this.splash = new SplashScreen(this.map, this.config);
            this.splash.startup();
          }

        }
        catch (e) {
          console.log(e.message);
        }
        if (this.config.basemapWidgetVisible === undefined) {
          this.config.basemapWidgetVisible = true;
        }
        if (this.config.basemapWidgetVisible === null) {
          this.config.basemapWidgetVisible = true;
        }
        if (this.config.basemapWidgetVisible == true) {
          var basemapGalleryGroupQuery = null;
          if (this.config.orgInfo) {
            if (this.config.orgInfo.basemapGalleryGroupQuery) {
              basemapGalleryGroupQuery = this.config.orgInfo.basemapGalleryGroupQuery;


            }
          }
          this.basemapButton = new BasemapButton(
              {
                basemapGalleryGroupQuery: basemapGalleryGroupQuery,
                domNode: "basemapDiv",
                config: this.config
              });
          this.basemapButton.startup();
        }
        var zoomScale = 16;
        if (this.config != null) {
          if (this.config.zoomLevel != null) {

            zoomScale = this.config.zoomLevel;
          }
        }
        this.navigationButtons = new NavigationButtons({
          zoomScale: zoomScale,
          domNode: "mapButtons"

        });
        this.navigationButtons.startup();

        promise = this._createWebMap(itemInfo);
      } else {
        var error = new Error("Main:: Config is not defined");
        this.reportError(error);
        var def = new Deferred();
        def.reject(error);
        promise = def.promise;
      }
      return promise;
    },
    _initDrawer: function () {
      if (this.config.showUI){
        if (this.config.showUI == true) {
          return;
        }
      }
      this._drawer.hide();
    },

    reportError: function (error) {
      // remove loading class from body
      domClass.remove(document.body, "app-loading");
      domClass.add(document.body, "app-error");
      // an error occurred - notify the user. In this example we pull the string from the
      // resource.js file located in the nls folder because we've set the application up
      // for localization. If you don't need to support multiple languages you can hardcode the
      // strings here and comment out the call in index.html to get the localization strings.
      // set message
      var node = dom.byId("loading_message");
      if (node) {
        if (this.config && this.config.i18n) {
          node.innerHTML = this.config.i18n.map.error + ": " + error.message;
        } else {
          node.innerHTML = "Unable to create map: " + error.message;
        }
      }
      return error;
    },
    _resizeMap: function () {
      var w = window.innerWidth;
      var h = window.innerHeight;
      dojo.byId("mapDiv").style.width = w;
      dojo.byId("mapDiv").style.height = h;

      this.map.resize();
      this.map.reposition();
      clearTimeout(this.resizeTimeout);

    },

    _mapLoaded: function () {
      // Map is ready
      try {
        console.log("map loaded");
        //search control
        this.search = new Search(
            {
              config: this.config,
              domNode: "searchDiv",
              map: this.map,
              href: document.location.href
            });
        this.search.startup();

        this.popup = new CombinedPopup(this.map, this.config, this.layers, this.handler);

        this.popup.startup();
        this.popup.enableMapClick();

        this._toggleIndicator(false);

        topic.publish("app/mapLoaded", this.map);

      }
      catch (e) {
        this.reportError(e);
      }
    },
    _mapLocate: function () {

        //this.map.centerAt(arguments[0]);

    },
    _controlLoaded: function (evt) {
      console.log(evt.Name + " created");
    },
    _toggleIndicator: function (events) {
      if (events) {
        domClass.add(document.body, "app-loading");
      } else {
        domClass.remove(document.body, "app-loading");
      }
    },

    _checkEditing: function () {
      if (this.config.editingAllowed == null) {
        this.config.editingAllowed = false;

        if (this.config == null) {
          this.config.editingAllowed = true;

        }
        if (this.config.userPrivileges == null) {
          this.config.editingAllowed = true;

        } else {
          for (var key in this.config.userPrivileges) {
            if (this.config.userPrivileges[key] == "features:user:edit") {
              this.config.editingAllowed = true;
              return this.config.editingAllowed;

            }
          }
        }

      }
      return this.config.editingAllowed;

    },

    
    // create a map based on the input web map id
    _createWebMap: function (itemInfo) {
      // set extent from config/url
      itemInfo = this._setExtent(itemInfo);
      // Optionally define additional map config here for example you can
      // turn the slider off, display info windows, disable wraparound 180, slider position and more.
      var mapOptions = {};
      // set zoom level from config/url
      mapOptions = this._setLevel(mapOptions);
      // set map center from config/url
      mapOptions = this._setCenter(mapOptions);
      // create webmap from item
      return arcgisUtils.createMap(itemInfo, "mapDiv", {
        mapOptions: mapOptions,
        usePopupManager: true,
        layerMixins: this.config.layerMixins || [],
        editable: this.config.editable,
        bingMapsKey: this.config.bingKey
      }).then(lang.hitch(this, function (response) {
        // Once the map is created we get access to the response which provides important info
        // such as the map, operational layers, popup info and more. This object will also contain
        // any custom options you defined for the template. In this example that is the 'theme' property.
        // Here' we'll use it to update the application to match the specified color theme.
        // console.log(this.config);
        this.map = response.map;
        //added for information lookup
        this.config.response = response
        this.layers = response.itemInfo.itemData.operationalLayers;

        // remove loading class from body
        domClass.remove(document.body, "app-loading");
        // Start writing code
        /* ---------------------------------------- */
        /*  Map is ready. Start writing code        */
        /* ---------------------------------------- */   
        this._mapLoaded();
        /* ---------------------------------------- */
        /*                                          */
        /* ---------------------------------------- */
        // return for promise
        return response;
        // map has been created. You can start using it.
        // If you need map to be loaded, listen for it's load event.
      }), this.reportError);
    },

    _setLevel: function (options) {
      var level = this.config.level;
      //specify center and zoom if provided as url params 
      if (level) {
        options.zoom = level;
      }
      return options;
    },

    _setCenter: function (options) {
      var center = this.config.center;
      if (center) {
        var points = center.split(",");
        if (points && points.length === 2) {
          options.center = [parseFloat(points[0]), parseFloat(points[1])];
        }
      }
      return options;
    },

    _setExtent: function (info) {
      var e = this.config.extent;
      //If a custom extent is set as a url parameter handle that before creating the map
      if (e) {
        var extArray = e.split(",");
        var extLength = extArray.length;
        if (extLength === 4) {
          info.item.extent = [[parseFloat(extArray[0]), parseFloat(extArray[1])], [parseFloat(extArray[2]), parseFloat(extArray[3])]];
        }
      }
      return info;
    }

  });
});