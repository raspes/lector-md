# Documento hostil (prueba de saneado)

<script>window.__x1 = 1</script>
<img src="https://tracker.example.invalid/pixel.png" onerror="window.__x2 = 1">
<a href="javascript:window.__x3 = 1">enlace javascript</a>
<iframe src="https://evil.example.invalid/"></iframe>
<object data="https://evil.example.invalid/x"></object>
<video src="https://evil.example.invalid/v.mp4" poster="https://evil.example.invalid/p.png"></video>
<div onclick="window.__x1 = 2" style="background:url(https://evil.example.invalid/bg.png)">bloque con handler y estilo</div>

![imagen remota](https://tracker.example.invalid/remote.png)
