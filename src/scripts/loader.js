// 加载指示器脚本
// 当Vue应用加载完成后隐藏加载器

window.addEventListener('load', function() {
  setTimeout(function() {
    const loader = document.getElementById('initial-loader');
    if (loader) {
      loader.classList.add('loader-hiding');
      setTimeout(() => {
        loader.remove();
      }, 300);
    }
  }, 100);
});