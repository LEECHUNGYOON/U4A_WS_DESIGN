//application 생성시 추가 입력정보 팝업 호출.
oAPP.fn.createApplicationPopup = function(appid){

    //valueState 바인딩 필드 초기화.
    function lf_resetValueStateField(cs_appl){

      //valueState 바인딩 필드.
      cs_appl.APPNM_stat = null;  //Web Application Name
      cs_appl.LANGU_stat = null;  //Language Key
      cs_appl.CODPG_stat = null;  //Character Format
      cs_appl.UITHM_stat = null;  //UI5 UI Theme
      cs_appl.PACKG_stat = null;  //Package
      cs_appl.REQNR_stat = null;  //Request No.

      //valueStateText 바인딩 필드.
      cs_appl.APPNM_stxt = null;  //Web Application Name
      cs_appl.LANGU_stxt = null;  //Language Key
      cs_appl.CODPG_stxt = null;  //Character Format
      cs_appl.UITHM_stxt = null;  //UI5 UI Theme
      cs_appl.PACKG_stxt = null;  //Package
      cs_appl.REQNR_stxt = null;  //Request No.

    }

    //application 생성전 입력값 점검.
    function lf_chkValue(){
      var ls_appl = oModel.getProperty('/CREATE');

      //valueState 바인딩 필드 초기화.
      lf_resetValueStateField(ls_appl);

      var l_err = false;

      //Web Application Name 이 입력되지 않은경우.
      if(ls_appl.APPNM === ""){
        ls_appl.APPNM_stat = 'Error';
        ls_appl.APPNM_stxt = 'Application Name is required entry value.';
        l_err = true;
      }


      //Package가 입력되지 않은 경우.
      if(ls_appl.PACKG === ""){
        ls_appl.PACKG_stat = 'Error';
        ls_appl.PACKG_stxt = 'Package is required entry value.';
        l_err = true;
      }

      //Y, Z 이외의 패키지명을 입력한 경우.
      if(ls_appl.PACKG !== "$TMP" &&
         ls_appl.PACKG.substr(0,1) !== "Y" &&
         ls_appl.PACKG.substr(0,1) !== "Z"){

         ls_appl.PACKG_stat = 'Error';
         ls_appl.PACKG_stxt = 'Standard package cannot be entered.';

         l_err = true;
      }

      //개발 패키지를 입력한경우 CTS번호를 입력하지 않은경우.
      if(ls_appl.PACKG !== "$TMP" && ls_appl.PACKG !== "" && ls_appl.REQNR === ""){
        ls_appl.REQNR_stat = 'Error';
        ls_appl.REQNR_stxt = 'If not a local object, Request No. is required entry value.';
        l_err = true;
      }

      //입력값에 오류 사항이 존재하는 경우 exit.
      if(l_err === true){
        oModel.setData({"CREATE":ls_appl});
        return l_err;
      }

    }


    //초기값 설정.
    function lf_setDefaultVal(){

      var ls_appl = {};

      //Web Application Name
      ls_appl.APPNM = "";

      //Language Key
      ls_appl.LANGU = "EN";

      //Character Format
      ls_appl.CODPG = "utf-8";

      //UI5 UI Theme
      ls_appl.UITHM = "sap_fiori_3";

      //Package
      ls_appl.PACKG = "$TMP";

      //Request No.
      ls_appl.REQNR = "";

      //Request No. 입력 가능 여부 바인딩 필드.
      ls_appl.REQNR_edit = false;

      //Request No. 필수 입력 여부 바인딩 필드.
      ls_appl.REQNR_requ = false;

      //valueState 바인딩 필드 초기화.
      lf_resetValueStateField(ls_appl);

      //Language Key DDLB 리스트
      ls_appl.T_LANGU = [{KEY:"EN",TEXT:"English"},
                         {KEY:"KO",TEXT:"Korean"}
                        ];

      //Character Format DDLB 리스트
      ls_appl.T_CODPG = [{KEY:"utf-8",TEXT:"utf-8"},
                         {KEY:"EUC-KR",TEXT:"EUC-KR"}
                        ];

      //UI5 UI Theme DDLB 리스트
      ls_appl.T_UITHM = [{KEY:"base",TEXT:"base"},
                         {KEY:"sap_belize",TEXT:"sap_belize"},
                         {KEY:"sap_belize_hcb",TEXT:"sap_belize_hcb"},
                         {KEY:"sap_belize_hcw",TEXT:"sap_belize_hcw"},
                         {KEY:"sap_belize_plus",TEXT:"sap_belize_plus"},
                         {KEY:"sap_bluecrystal",TEXT:"sap_bluecrystal"},
                         {KEY:"sap_hcb",TEXT:"sap_hcb"},
                         {KEY:"sap_fiori_3",TEXT:"sap_fiori_3"},
                         {KEY:"sap_fiori_3_dark",TEXT:"sap_fiori_3_dark"},
                         {KEY:"sap_fiori_3_hcb",TEXT:"sap_fiori_3_hcb"},
                         {KEY:"sap_fiori_3_hcw",TEXT:"sap_fiori_3_hcw"},
                        ];


      oModel.setData({"CREATE":ls_appl});

    }

    //dialog 종료 처리.
    function lf_closeDialog(){
      oCreateDialog.close();
      oCreateDialog.destroy();

    }

    //Web Application Name Input Field
    var oInpDesc = new sap.m.Input({
      value:"{/CREATE/APPNM}",
      valueState:"{/CREATE/APPNM_stat}",
      valueStateText:"{/CREATE/APPNM_stxt}"
    });

    //Language Key Input Field
    var oInpLang = new sap.m.ComboBox({
      selectedKey:"{/CREATE/LANGU}",
      valueState:"{/CREATE/LANGU_stat}",
      valueStateText:"{/CREATE/LANGU_stxt}"
    });

    oInpLang.bindAggregation("items", {
      path: "/CREATE/T_LANGU",
      template: new sap.ui.core.Item({
        key : "{KEY}",
        text : "{TEXT}"
      })
    });


    //Character Format DDLB
    var oSelFormat = new sap.m.Select({
        selectedKey: "{/CREATE/CODPG}",
        valueState:"{/CREATE/CODPG_stat}",
        valueStateText:"{/CREATE/CODPG_stxt}"
      });

    oSelFormat.bindAggregation("items", {
      path: "/CREATE/T_CODPG",
      template: new sap.ui.core.Item({
        key : "{KEY}",
        text : "{TEXT}"
      })
    });

    //UI5 UI Theme
    var oSelTheme = new sap.m.Select({
        selectedKey: "{/CREATE/UITHM}",
        valueState:"{/CREATE/UITHM_stat}",
        valueStateText:"{/CREATE/UITHM_stxt}"
    });

    oSelTheme.bindAggregation("items", {
      path: "/CREATE/T_UITHM",
      template: new sap.ui.core.Item({
        key : "{KEY}",
        text : "{TEXT}"
      })
    });


    //Package Input Field
    var oInpPack = new sap.m.Input({
      value:"{/CREATE/PACKG}",
      valueState:"{/CREATE/PACKG_stat}",
      valueStateText:"{/CREATE/PACKG_stxt}"
    });

    oInpPack.attachChange(function(){
      var l_val = this.getValue();

      //입력 패키지명 대문자 변환 처리.
      l_val = l_val.toUpperCase();

      this.setValue(l_val);

      var l_edit = true;
      var l_requ = true;
      var l_reqnr = oInpReqNo.getValue();

      //로컬 패키지를 입력한 경우.
      if(l_val === "$TMP"){
        l_edit = false; //Request No. 잠금 처리.
        l_requ = false; //Request No. 필수입력 false 처리
        l_reqnr = "";   //기존 입력 Request No. 초기화.
      }

      oInpReqNo.setEditable(l_edit);
      oInpReqNo.setRequired(l_requ);
      oInpReqNo.setValue(l_reqnr);

    });

    //Request No. Input Field
    var oInpReqNo = new sap.m.Input({
      value:"{/CREATE/REQNR}",
      valueState:"{/CREATE/REQNR_stat}",
      required:"{/CREATE/REQNR_requ}",
      editable:"{/CREATE/REQNR_edit}",
    });


    var oCreateDialogForm = new sap.ui.layout.form.Form({
      editable: true,
      layout : new sap.ui.layout.form.ResponsiveGridLayout({
        labelSpanXL: 2,
        labelSpanL: 3,
        labelSpanM: 3,
        labelSpanS: 12,
        singleContainerFullSize: false
      }),
      formContainers: [
        new sap.ui.layout.form.FormContainer({
          formElements : [
            new sap.ui.layout.form.FormElement({
              label : new sap.m.Label({
                required: true,
                design: "Bold",
                text: "Web Application Name"
              }),
              fields : oInpDesc
            }),
            new sap.ui.layout.form.FormElement({
              label : new sap.m.Label({
                design: "Bold",
                text: "Language Key"
              }),
              fields : oInpLang
            }),
            new sap.ui.layout.form.FormElement({
              label : new sap.m.Label({
                design: "Bold",
                text: "Character Format"
              }),
              fields : oSelFormat
            }),
            new sap.ui.layout.form.FormElement({
              label : new sap.m.Label({
                design: "Bold",
                text: "UI5 UI Theme",
              }),
              fields : oSelTheme
            }),
            new sap.ui.layout.form.FormElement({
              label : new sap.m.Label({
                required: true,
                design: "Bold",
                text: "Package",
              }),
              fields : oInpPack
            }),
            new sap.ui.layout.form.FormElement({
              label : new sap.m.Label({
                design: "Bold",
                text: "Request No.",
              }),
              fields : oInpReqNo
            }),
          ]
        }),
      ]
    });

    // Application 생성 Dialog
    var oCreateDialog = new sap.m.Dialog({
      draggable: true,
      resizable: true,
      contentWidth: "50%",
      title: "UI5 Application Create Option Selection",
      titleAlignment: "Center",
      icon: "sap-icon://document",
      buttons: [
        new sap.m.Button({
          type: "Accept",
          icon: "sap-icon://accept",
          press : function(){

            //application 생성 처리전 입력값 점검.
            if( lf_chkValue() === true){
              return;
            }

            var l_create = oModel.getProperty('/CREATE');
            var l_appdata = {};
            l_appdata.APPID = appid;
            l_appdata.APPNM = l_create.APPNM;
            l_appdata.LANGU = l_create.LANGU;
            l_appdata.CODPG = l_create.CODPG;
            l_appdata.UITHM = l_create.UITHM;
            l_appdata.PACKG = l_create.PACKG;
            l_appdata.REQNR = l_create.REQNR;


            //application명 서버전송 데이터 구성.
            var oFormData = new FormData();
            oFormData.append("APPDATA", JSON.stringify(l_appdata));


            //application 생성을 위한 서버 호출.
            sendAjax(parent.getServerPath() + '/createAppData',oFormData, function(ret){

              //생성 처리 성공 이후 work space UI editor 화면으로 이동 처리.
              onAppCrAndChgMode(appid);

              //dialog 종료 처리.
              lf_closeDialog();

            });


          }
        }),
        new sap.m.Button({
          type: "Reject",
          icon: "sap-icon://decline",
          press: lf_closeDialog
        }),
      ],

      content: [
        oCreateDialogForm
      ]

    });

    var oModel = new sap.ui.model.json.JSONModel();
    oCreateDialog.setModel(oModel);

    //default 정보 바인딩.
    lf_setDefaultVal();

    oCreateDialog.open();

};
