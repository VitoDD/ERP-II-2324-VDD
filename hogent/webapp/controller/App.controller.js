sap.ui.define(
  ["sap/ui/core/mvc/Controller"],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (Controller) {
    "use strict";

    return Controller.extend("hogent.controller.App", {
      onInit: function () {},
      handleEventItemPressed: function (oEvent) {
        //Get data from click event on table
        let sId = oEvent.getSource().getBindingContext().getProperty("Id");

        //Get router
        var oRouter = this.getOwnerComponent().getRouter();
        oRouter.navTo("Detailpage", { id: sId });
      },
      onAdd: function () {
        if (!this.pDialog) {
          this.pDialog = this.loadFragment({
            name: "hogent.view.Add",
          });
        }
        this.pDialog.then(function (oDialog) {
          oDialog.open();
        });
      },
      uuidgen: function () {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
          /[xy]/g,
          function (c) {
            var r = (Math.random() * 16) | 0,
              v = c == "x" ? r : (r & 0x3) | 0x8;
            return v.toString(16);
          }
        );
      },

      onStudentAdd: function () {
        var oDataModel = this.getView().getModel();
        var oForm = this.getView().getModel("form").getData();
        oForm.Id = this.uuidgen();

        console.log(oForm);

        oDataModel.create("/Z74StudentsSet", oForm, {
          success: function (data, response) {
            sap.m.MessageBox.success("Student was created successfully");
          },
          error: function (error) {
            sap.m.MessageBox.error("Error while creating student");
          },
        });
      },

      beforeStudentAdd: function (oEvent) {
        this.getView().setModel(
          new sap.ui.model.json.JSONModel({
            Id: "",
            Firstname: "",
            Lastname: "",
          }),
          "form"
        );
      },
    });
  }
);
