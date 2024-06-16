sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
  ],

  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (Controller, Filter, Filt) {
    "use strict";

    return Controller.extend("hogent.controller.Detailpage", {
      onInit: function () {
        this.oOwnerComponent = this.getOwnerComponent();
        this.oRouter = this.oOwnerComponent.getRouter();
        this.oRouter.attachRoutePatternMatched(this._onRouteMatched, this);
      },
      _onRouteMatched: function (oEvent) {
        var oArgs;
        oArgs = oEvent.getParameter("arguments");
        this.studentId = oArgs.id;
        var oView = this.getView();
        console.log("   " + oArgs.id);
        var urlPath = "/Z74StudentsSet(guid'" + oArgs.id + "')";
        var oDataModel = oView.getModel();
        oView.bindElement({ path: urlPath });

        this.readElement(urlPath, oDataModel).done(
          function (oData) {
            this.studentId = oArgs.id;
            this.loadFavoriteGames(this.studentId);
          }.bind(this)
        );
      },
      readElement: function (path, odatamodel) {
        var oDeferred = jQuery.Deferred();

        odatamodel.read(path, {
          success: function (oData) {
            return oDeferred.resolve(oData);
          }.bind(this),
          error: function (oError) {
            return oDeferred.reject(oError);
          }.bind(this),
        });

        return oDeferred.promise();
      },
      onGameAdd: function () {
        if (!this.pDialog) {
          this.pDialog = this.loadFragment({
            name: "hogent.view.Addgame",
          });
        }
        this.pDialog.then(function (oDialog) {
          oDialog.open();
        });
      },

      onGameAdder: function () {
        var oDataModel = this.getView().getModel();
        var oForm = this.getView().getModel("form").getData();
        oForm.Gameid = this.getView().byId("addgame").getSelectedKey();

        console.log(oForm);

        oDataModel.create("/Z74FavoGamesSet", oForm, {
          success: function (data, response) {
            sap.m.MessageBox.success("Student was created successfully");
          },
          error: function (error) {
            sap.m.MessageBox.error("Error while creating Game");
          },
        });
      },

      beforeGameAdd: function (oEvent) {
        this.getView().setModel(
          new sap.ui.model.json.JSONModel({
            Studentid: this.studentId,
            Gameid: "",
          }),
          "form"
        );
      },
      loadFavoriteGames: function (id) {
        console.log(id);
        var table = this.byId("idGames");
        var idFilter = [new Filter("Studentid", FilterOperator.EQ, id)];
        table.getBinding("items").filter(idFilter, "Application");
      },
    });
  }
);
