async function drawInit() {
  const response = await fetch('./china.json');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  const res = await response.json();
  const mapData = res.features;

  const svg = document.getElementById('map');
  const scale = 100; // 调整缩放比例以适应屏幕大小
  const translateX = 200; // 水平偏移
  const translateY = 100; // 垂直偏移

  // 函数：绘制单个多边形
  function drawPolygon(coordinates, fillColor = 'lightblue', strokeColor = 'black', strokeWidth = 1) {
    const pathData = coordinates.map(coord => {
      return `${(coord[0] * scale + translateX).toFixed(0)},${(coord[1] * scale + translateY).toFixed(0)}`;
    }).join(' ');

    const polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    polygon.setAttribute("points", pathData);
    polygon.setAttribute("fill", fillColor);
    polygon.setAttribute("stroke", strokeColor);
    polygon.setAttribute("stroke-width", strokeWidth);

    svg.appendChild(polygon);
  }

  // 遍历每个特征并绘制
  mapData.forEach(feature => {
    if (feature.geometry.type === 'Polygon') {
      drawPolygon(feature.geometry.coordinates[0], 'lightblue', 'black', 1);
    } else if (feature.geometry.type === 'MultiPolygon') {
      feature.geometry.coordinates.forEach(coords => {
        drawPolygon(coords[0], 'lightblue', 'black', 1);
      });
    }
  });
}

drawInit();