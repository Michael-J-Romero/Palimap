(function() {
    if (typeof window !== "undefined" && window.L && !window.L.TileLayer.BoundaryCanvas) {
        L.TileLayer.BoundaryCanvas = L.TileLayer.extend({
          options: {
            async: true
          },
      
          initialize: function (url, options) {
            L.TileLayer.prototype.initialize.call(this, url, options);
            this._boundary = options.boundary;
          },
      
          createTile: function (coords, done) {
            const tileSize = this.getTileSize();
            const canvas = document.createElement("canvas");
            canvas.width = tileSize.x;
            canvas.height = tileSize.y;
            const ctx = canvas.getContext("2d");
      
            const img = new Image();
            img.crossOrigin = "Anonymous";
            img.src = this.getTileUrl(coords);
      
            img.onload = () => {
              const nwPoint = coords.scaleBy(tileSize);
              const scale = this._map.getZoomScale(coords.z);
      
              const path = new Path2D();
      
              this._boundary.eachLayer((layer) => {
                if (!layer.getLatLngs) return;
      
                const latlngs = layer.getLatLngs();
                const rings = Array.isArray(latlngs[0]) ? latlngs : [latlngs];
      
                rings.forEach((ring) => {
                  const flat = Array.isArray(ring[0]) ? ring.flat() : ring;
                  if (flat.length === 0) return;
      
                  const first = this._map.project(flat[0], coords.z).subtract(nwPoint);
                  path.moveTo(first.x, first.y);
      
                  flat.forEach((latlng) => {
                    const point = this._map.project(latlng, coords.z).subtract(nwPoint);
                    path.lineTo(point.x, point.y);
                  });
      
                  path.closePath();
                });
              });
      
              // Clip to boundary and draw image
              ctx.save();
              ctx.clip(path);
              ctx.drawImage(img, 0, 0, tileSize.x, tileSize.y);
              ctx.restore();
      
              done(null, canvas);
            };
      
            img.onerror = () => {
              done(new Error("Tile load error"), canvas);
            };
      
            return canvas;
          }
        });
      
        L.tileLayer.boundaryCanvas = function (url, options) {
          return new L.TileLayer.BoundaryCanvas(url, options);
        };
      }
      
    })();
    