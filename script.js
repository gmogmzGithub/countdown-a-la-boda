var ringer = {
  countdown_to: "02/14/2025 12:00:00",
  rings: {
    'WEEKS': {
      s: 604800000, // milliseconds in a week,
      max: 52
    },
    'MONTHS': {
      s: 2628000000, // milliseconds in a month (approximation),
      max: 12
    }
  },
  r_count: 2,
  r_spacing: 10, // px
  r_size: 200, // px
  r_thickness: 7, // px
  update_interval: 1000, // ms

  init: function () {
    $r = ringer;
    $r.cvs = document.createElement('canvas');

    $r.size = {
      w: ($r.r_size + $r.r_thickness) * $r.r_count + ($r.r_spacing * ($r.r_count - 1)),
      h: ($r.r_size + $r.r_thickness)
    };

    $r.cvs.setAttribute('width', $r.size.w);
    $r.cvs.setAttribute('height', $r.size.h);
    $r.ctx = $r.cvs.getContext('2d');
    $(document.body).append($r.cvs);
    $r.cvs = $($r.cvs);
    $r.ctx.textAlign = 'center';
    $r.actual_size = $r.r_size + $r.r_thickness;
    $r.countdown_to_time = new Date($r.countdown_to).getTime();
    $r.cvs.css({ width: $r.size.w + "px", height: $r.size.h + "px" });
    $r.go();
  },
  ctx: null,
  go: function () {
    var idx = 0;

    $r.time = ($r.countdown_to_time - new Date().getTime());

    for (var r_key in $r.rings) $r.unit(idx++, r_key, $r.rings[r_key]);

    setTimeout($r.go, $r.update_interval);
  },
  unit: function (idx, label, ring) {
    var x, y, value, ring_secs = ring.s;
    if (label === 'WEEKS') {
      value = Math.floor($r.time / ring_secs);
    } else if (label === 'MONTHS') {
      var now = new Date();
      var future = new Date($r.countdown_to);
      value = (future.getFullYear() - now.getFullYear()) * 12 + (future.getMonth() - now.getMonth());
    }

    x = ($r.r_size * 0.5 + $r.r_thickness * 0.5);
    x += (idx * ($r.r_size + $r.r_spacing + $r.r_thickness));
    y = $r.r_size * 0.5;
    y += $r.r_thickness * 0.5;

    var degrees = 360 - (value / ring.max) * 360.0;
    var endAngle = degrees * (Math.PI / 180);

    $r.ctx.save();

    $r.ctx.translate(x, y);
    $r.ctx.clearRect($r.actual_size * -0.5, $r.actual_size * -0.5, $r.actual_size, $r.actual_size);

    // Outer circle
    $r.ctx.strokeStyle = "rgba(128,128,128,0.6)";
    $r.ctx.beginPath();
    $r.ctx.arc(0, 0, $r.r_size / 2, 0, 2 * Math.PI, 2);
    $r.ctx.lineWidth = $r.r_thickness;
    $r.ctx.stroke();

    // Inner circle
    $r.ctx.strokeStyle = "rgba(253, 128, 1, 0.9)";
    $r.ctx.beginPath();
    $r.ctx.arc(0, 0, $r.r_size / 2, 0, endAngle, 1);
    $r.ctx.lineWidth = $r.r_thickness;
    $r.ctx.stroke();

    // Label
    $r.ctx.fillStyle = "#000000";
    $r.ctx.font = '25px Helvetica';
    $r.ctx.fillText(label, 0, 23);
    $r.ctx.strokeStyle = "#696969";
    $r.ctx.lineWidth = 0.8;
    $r.ctx.strokeText(label, 0, 23);

    $r.ctx.font = 'bold 60px Helvetica';
    $r.ctx.fillText(Math.max(value, 0), 0, -5);
    $r.ctx.strokeText(Math.max(value, 0), 0, -5);

    $r.ctx.restore();
  }
}

ringer.init();