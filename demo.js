/*
  DANH SÁCH NHẠC DEMO CÔNG KHAI

  Chỉ thêm những bài được phép xuất hiện trên trang Demo Khách.
  Không đặt mã khách hàng, mã PIN hoặc dữ liệu album riêng trong file này.
*/

const demoSongs = [
  {
    title: "Màu hoa bí",
    artist: "Hoàng Uyên",
    avatar: "logo.png",
    listenLink:
      "https://raw.githubusercontent.com/dinhtuan60music-cmd/anhtuanstudio/81490acbd7f5e53e5eebed6e0854e2a15870a03f/files/MAU%20HOA%20BI%20-%20HOANG%20UYEN%20-%20MASTER.mp3",
    downloadLink: "",
    priority: 1
  },
  {
    title: "Màu hoa cải",
    artist: "Hoàng Uyên",
    avatar: "logo.png",
    listenLink:
      "https://raw.githubusercontent.com/dinhtuan60music-cmd/anhtuanstudio/81490acbd7f5e53e5eebed6e0854e2a15870a03f/files/MAU%20HOA%20BI%20-%20HOANG%20UYEN%20-%20MASTER.mp3",
    downloadLink: "",
    priority: 1
  },
  {
    title: "Nhạc test thử nghiệm",
    artist: "Thanh Sáng",
    avatar: "logo.png",
    listenLink: "https://music.anhtuanstudio.com/music/test.mp3",
    downloadLink: "",
    priority: 98
  },
  {
    title: "50 Năm về sau",
    artist: "Thanh Sáng",
    avatar: "logo.png",
    listenLink:
      "https://dl.ithcm.vn/TEMP/50%20NAM%20VE%20SAU%20-%20MASTER.wav",
    downloadLink: "",
    priority: 99
  }
];

window.demoSongs = demoSongs;
