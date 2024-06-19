/**  ================================
 *   | Bài tập js buổi 9-10          |
 *   |  (Quản lý Nhân viên)          |
 *   | Handler: Bùi Hữu Công         |
 *   =================================*/

// mảng chứa toàn bộ nhân viên
let arrNhanVien = [];

// =========[Lấy thông tin NV từ form]=========
function getValueFormNV(nguonChayHam) {
  let isValid = true;
  // tạo 1 object nhanVien có thuộc tính từ lớp đối tượng
  let nhanVien = new NhanVien();
  // console.log(nhanVien);
  // DOM tới trường dữ liệu lưu trữ vào mảng chứa đối tượng
  let arrField = document.querySelectorAll("#formQLNV input, #formQLNV select");

  // ============== duyệt qua mảng để lấy dữ liệu nạp vào object nhanVien =============
  for (let field of arrField) {
    // console.log(field);
    // bóc tách #id, value của object field
    let { id, value } = field;
    // nạp vào đối tượng nhanVien
    nhanVien[id] = value; //nhanVien["tknv"] = "yourUserName"
    // =========[Validate dữ liệu]=========
    let parent = field.parentElement.parentElement;
    // console.log(parent);
    let errorField = parent.querySelector("span.sp-thongbao");
    let check = checkEmptyValue(value, errorField);
    isValid &= check;
    console.log("1--", check, isValid);

    // check tknv và email trùng (chỉ chạy cho riêng case thêm mới NV)
    if (nguonChayHam == "NEW_NV") {
      for (let oldNhanVien of arrNhanVien) {
        if (value == oldNhanVien.tknv) {
          // alert("trùng tknv");
          errorField.innerHTML = "Tài khoản này đã tồn tại!";
          errorField.style.display = "block";
          errorField.parentElement
            .querySelector("input")
            .classList.remove("valid");
          isValid &= false;
        }
        if (value == oldNhanVien.email) {
          // alert("trùng email");
          errorField.innerHTML = "Email này đã tồn tại!";
          errorField.style.display = "block";
          errorField.parentElement
            .querySelector("input")
            .classList.remove("valid");
          isValid &= false;
        }
      }
    }

    if (check) {
      isValid &= field.classList.contains("valid");
    }

    // EOF =====[Validate dữ liệu]=====
  }

  if (isValid) {
    return nhanVien;
  } else {
    console.error("Dữ liệu không hợp lệ");
    return null;
  }
}
// EOF =====[Lấy thông tin NV từ form]=====

// =========[render, lưu local storage & reset form]=========
function renderSaveReset() {
  // chạy hàm hiển thị lên giao diện
  renderArrNhanVien();
  // chạy hàm lưu xuống local storage
  saveLocalStorage();
  // xóa form
  // document.getElementById("formQLNV").reset();
  resetFormModal();
}
// EOF =====[render, lưu local storage & reset form]=====

// ============== Thêm Nhân viên mới =============
document.getElementById("formQLNV").addEventListener("submit", (event) => {
  event.preventDefault(); //ngăn reload
  let nhanVien = getValueFormNV("NEW_NV");
  if (!nhanVien) {
    return;
  } else {
    arrNhanVien.push(nhanVien);
    //hiển thị - lưu database - clear form
    renderSaveReset();
  }
});

// ============== Hiển thị dữ liệu lên table =============
function renderArrNhanVien(arr = arrNhanVien) {
  let content = "";
  // 1. duyệt mảng arr
  for (let nhanVien of arr) {
    let newArrNhanVien = new NhanVien(); // để tránh thay đổi mảng gốc arrNhanVien -> sd được các phương thức trong lớp đối tượng
    Object.assign(newArrNhanVien, nhanVien);
    let { tknv, name, email, datepicker, chucvu } = newArrNhanVien;
    content += `
    <tr>
      <td>${tknv}</td>
      <td>${name}</td>
      <td>${email}</td>
      <td>${datepicker}</td>
      <td>${chucvu}</td>
      <td>${vnd(newArrNhanVien.tongLuongNV())}</td>
      <td>${newArrNhanVien.xepLoaiNV()}</td>
      <td>
        <button onclick="deleteNhanVien('${tknv}')" class="btn btn-danger btnDED">Xoá</button>
        <button onclick="getInfoNhanVien('${tknv}')" class="btn btn-warning btnDED">Sửa</button></td>
    </tr>
    `;
  }
  // 2. hiển thị lên tbody
  document.getElementById("tableDanhSach").innerHTML = content;
  // 3. lưu data xuống local storage
  // saveLocalStorage();
}

// ============== Lưu local Storage =============
function saveLocalStorage(key = "arrNhanVien", value = arrNhanVien) {
  let stringJSON = JSON.stringify(value);
  localStorage.setItem(key, stringJSON);
}

// ============== Lấy dữ liệu từ local storage =============
getLocalStorage(); // đổ dữ liệu khi load trang
function getLocalStorage(key = "arrNhanVien") {
  let arrLocal = localStorage.getItem(key);
  if (arrLocal) {
    arrNhanVien = JSON.parse(arrLocal);
    renderArrNhanVien();
  }
}

// ============== Xóa nhân viên =============
function deleteNhanVien(maNhanVien) {
  // console.log(arrNhanVien);
  let text = `Bạn có chắc xóa nhân viên [${maNhanVien}] khỏi danh sách?`;
  if (confirm(text) == true) {
    let index = arrNhanVien.findIndex((item) => {
      return item.tknv == maNhanVien;
    });
    console.log(index); // index cần xóa
    arrNhanVien.splice(index, 1); // xóa nhanVien ở vị trí index
    renderSaveReset();
  } else {
    return false;
  }
}

// =========[Chỉnh sửa thông tin NV]=========
//**** 1. Get thông tin nhân viên cần sửa =======
function getInfoNhanVien(maNhanVien) {
  console.log(arrNhanVien);
  // tìm đối tượng nhanVien cần sửa
  let nhanVienSua = arrNhanVien.find((item) => {
    return item.tknv == maNhanVien;
  });
  console.log(nhanVienSua);
  let arrField = document.querySelectorAll("#formQLNV input, #formQLNV select");
  for (let field of arrField) {
    let { id, value } = field; // = nhanVienSua{itemName : value}
    field.value = nhanVienSua[id];

    //set các field về trạng thái dữ liệu hợp lệ
    field.classList.add("valid");
  }
  console.log(arrField);
  // show modal
  $("#myModal").modal("show");

  // chặn người dùng chỉnh sửa input tknv
  document.getElementById("tknv").readOnly = true;
  // chặn người dùng click nút thêm nhân viên
  document.getElementById("btnThemNV").disabled = true;
  // Bỏ chặn click nút cập nhật
  document.getElementById("btnCapNhat").disabled = false;
}

// **** 2. Cập nhật lên giao diện và database =============
function updateNhanVien() {
  console.log(arrNhanVien);
  // console.log(arrNhanVien);
  //

  // lấy dữ liệu từ form
  let nhanVien = getValueFormNV("UPDATE_NV");
  // Kiểm tra xem nhanVien có hợp lệ không trước khi truy cập thuộc tính
  if (!nhanVien) {
    console.error("Đối tượng NhanVien không hợp lệ");
    return;
  }

  let index = arrNhanVien.findIndex((item) => {
    return item.tknv == nhanVien.tknv;
  });
  if (index != -1) {
    arrNhanVien[index] = nhanVien;
    renderSaveReset();
    // hide modal
    $("#myModal").modal("hide");
  }
}
document.getElementById("btnCapNhat").onclick = updateNhanVien;
// EOF =====[Chỉnh sửa thông tin NV]=====

document.getElementById("btnDong").onclick = resetFormModal;
document.getElementById("btnThem").onclick = () => {
  resetFormModal();
  // chặn click nút cập nhật
  document.getElementById("btnCapNhat").disabled = true;
};

// =========[Search nhân viên]=========
function searchNhanVien(event) {
  // console.log(arrNhanVien);
  // arrNhanVien hiện hữu -> lấy từ local storage nên ko có phương thức XepLoaiNV => Tạo mảng mới newArrNhanVien với các newNhanVien khởi tạo từ lớp đối tượng (để có phương thức) và copy các thuộc tính cũ của các nhanVien trong mảng arrNhanVien
  let newArrNhanVien = [];
  for (let nhanVien of arrNhanVien) {
    let newNhanVien = new NhanVien();
    Object.assign(newNhanVien, nhanVien);
    newArrNhanVien.push(newNhanVien);
  }
  // console.log(newArrNhanVien);

  let keyword = removeVietnameseTones(event.target.value.toLowerCase().trim());
  let arrNhanVienFilter = newArrNhanVien.filter(function (item, index) {
    let xepLoai = removeVietnameseTones(item.xepLoaiNV().toLowerCase().trim());
    return xepLoai.includes(keyword);
  });
  console.log("arrNhanVienFilter", arrNhanVienFilter);
  // cho hiển thị lên giao diện danh sách đã lọc
  renderArrNhanVien(arrNhanVienFilter);
}
document.getElementById("searchXepLoai").oninput = searchNhanVien;
// EOF =====[Search nhân viên]=====
