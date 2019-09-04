import $ from 'jquery'

// 学生列表
let studentList = [];

/**
 * 返回表单数据
 * @param formDom 表单dom元素
 * @returns {{address: *, sNo: *, phone: *, sex: *, name: *, birth: *, email: *}}
 */
function getStudentInfo(formDom){
    return {
        sNo: formDom.no.value,
        name: formDom.name.value,
        birth:  formDom.age.value,
        sex: formDom.sex.value,
        phone: formDom.phone.value,
        address: formDom.addr.value,
        email: formDom.email.value
    }
}

/**
 * 设置表单内容
 * @param formDom
 * @param nodeList
 */
function setStudentInfo(formDom, nodeList){
    formDom.no.value = nodeList[6].innerText;
    formDom.name.value = nodeList[5].innerText;
    formDom.age.value = (new Date().getFullYear()) - Number(nodeList[2].innerText);
    formDom.sex.value = nodeList[4].innerText === '男' ? 0 : 1;
    formDom.phone.value = nodeList[1].innerText;
    formDom.addr.value = nodeList[0].innerText;
    formDom.email.value = nodeList[3].innerText;
}


/**
 * 打印学生表格
 * @param data 学生信息数组
 */
function showTable(data){
    let tableDom = $('.student-list tbody');
    let table = '';
    studentList.forEach((oStudent)=>{
        table += '<tr><td>' + oStudent['sNo'] + '</td>' +
            '<td>' + oStudent['name'] +'</td>' +
            '<td>' + (oStudent['sex'].toString() === '0' ? '男': '女') + '</td>' +
            '<td>' + oStudent['email'] + '</td>' +
            '<td>' + (new Date().getFullYear() - oStudent['birth']) + '</td>' +
            '<td>' + oStudent['phone'] + '</td>' +
            '<td>' + oStudent.address + '</td>' +
            '<td class="make">' +
            '<span class="modify">编辑</span> ' +
            '<span class="delete">删除</span>' + '</td></tr>';
    });
    tableDom.html(table);
}

/**
 * 绑定菜单事件，切换内容
 */
function bindMenuEvent(){
    let menuDom = $('dd');
    let menuContentDom = $('.menu-content');
    menuDom.on('click', (e)=>{
        let target = $(e.target);
        let index = target.data('index');
        menuDom.removeClass('active');
        target.addClass('active');
        menuContentDom.addClass('none');
        $(menuContentDom[index]).removeClass('none');
    });
}

/**
 * 绑定编辑学生信息事件
 */
function bindModifyEvent(){
    let studentSno;
    let maskDom = $('.mask');
    let modifyBtn = $('.modify');
    let modifyBtnDom = $(".modify-btn[type='submit']");
    let modifyStudentDom = $('.modify-student');
    let modifyFormDom = $('.modify-student-form')[0];
    modifyBtn.on('click', (e)=>{
        // 当前编辑按钮的父节点的之前的所有兄弟节点
        let dom = $(e.target).parent().prevAll();
        studentSno = dom[6].innerText;
        modifyStudentDom.removeClass('none');
        setStudentInfo(modifyFormDom, dom);
        $(document).on('click', (e)=>{
            if(e.target === maskDom[0]){
                modifyStudentDom.addClass('none');
                $(document).off('click');
            }
        });
    });
    modifyBtnDom.off('click').on('click', (e)=>{
        e.preventDefault();
        e.stopPropagation();
        let oStudent = Object.assign({
            appkey: 'yaosheng_1554609836569'
        }, getStudentInfo(modifyFormDom));
        oStudent.sNo = studentSno;
        $.ajax({
            url: 'http://api.duyiedu.com/api/student/updateStudent',
            method: 'GET',
            data: oStudent,
            success: function(_data){
                let data = JSON.parse(_data);
                alert(data['msg']);
                if(data.status === 'success'){
                    maskDom.click();
                    refreshTable();
                }
            },
            error: function(e){
                console.log(e);
            }
        })
    })
}

/**
 * 刷新表格
 */
function refreshTable(){
    getStudentData();
    showTable(studentList);
    bindModifyEvent();
    bindDelStudentEvent();
}

/**
 * 绑定删除学生事件
 */
function bindDelStudentEvent(){
    let delBtn = $('.delete');
    delBtn.on('click', (e)=>{
        let delSNo = $(e.target).parent().prevAll()[6].innerText;
        let isDel = window.confirm('确认删除?');
        if(!isDel) return;
        $.ajax({
           url: 'http://api.duyiedu.com/api/student/delBySno',
            method: 'GET',
            data: {
                appkey: 'yaosheng_1554609836569',
                sNo: delSNo
            },
            success: function(_data){
               let data = JSON.parse(_data);
               alert(data['msg']);
               if(data.status === 'success'){
                   refreshTable();
               }
            },
            error: function(e){
               console.log(e);
            }
        });
    });
}

/**
 * 绑定添加学生事件
 */
function bindAddStudentEvent(){
    let listMenu = $("dd[data-index='0']");
    let addFromDom = $('.add-student-form')[0];
    let addBtn = $(".add-btn[type='submit']");
    let oStudent = {};
    addBtn.on('click', (e)=>{
        e.preventDefault();
        e.stopPropagation();
        oStudent = Object.assign({
            appkey: 'yaosheng_1554609836569'
        }, getStudentInfo(addFromDom));
        $.ajax({
            url: 'http://api.duyiedu.com/api/student/addStudent',
            method: 'GET',
            data: oStudent,
            success: function(_data){
                let data = JSON.parse(_data);
                alert(data['msg']);
                if(data.status === 'success'){
                    refreshTable();
                    addFromDom.reset();
                    listMenu.click();
                }
            }
        });
    });
}
/**
 * 统一绑定事件
 */
function bindEvent(){
    bindMenuEvent();
    bindModifyEvent();
    bindDelStudentEvent();
    bindAddStudentEvent();
}

function getStudentData(){
    $.ajax({
        url: 'http://api.duyiedu.com/api/student/findAll',
        method: 'GET',
        async: false,
        data: {
            appkey:'yaosheng_1554609836569'
        },
        success: function(_data){
            let data = JSON.parse(_data);
            if(data.status == 'success'){
                studentList = data.data;
            }else{
                alert(data.status);
            }
        },
        error: function(e){
            console.error(e);
        }
    });
}

/**
 * 程序入口
 */
function init(){
    getStudentData();
    showTable(studentList);
    bindEvent();
}

init();

