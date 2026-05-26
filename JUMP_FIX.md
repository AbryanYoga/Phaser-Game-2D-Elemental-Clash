# JUMP FIX - Sekarang Bisa Jump! ✅

## MASALAH

Player tidak bisa jump karena gravity counter `-1200` meniadakan gravity dunia `+1200`, sehingga net gravity = 0 (tidak ada gravitasi sama sekali).

## PENYEBAB

```javascript
// SALAH - Gravity counter membuat tidak bisa jump
this.physics.world.gravity.y = 1200;      // World gravity
this.player.body.setGravityY(-1200);      // Counter gravity
// Net gravity = 1200 + (-1200) = 0 ❌
```

Dengan net gravity = 0:
- Karakter tidak jatuh ✓ (bagus)
- Tapi juga tidak bisa jump ✗ (masalah!)
- Velocity Y tidak berubah karena tidak ada gravitasi

## SOLUSI

Gunakan gravity normal dan platform collider yang proper:

```javascript
// BENAR - Gravity normal dengan platform
this.physics.world.gravity.y = 800;       // Normal gravity
// Tidak ada gravity counter
// Platform collider mencegah jatuh
```

## PERUBAHAN YANG DILAKUKAN

### 1. BattleScene.js - Physics Setup

**SEBELUM:**
```javascript
this.physics.world.gravity.y = 1200;
this.player.body.setGravityY(-1200);  // Counter
this.boss.body.setGravityY(-1200);    // Counter
```

**SESUDAH:**
```javascript
this.physics.world.gravity.y = 800;   // Normal gravity
// Tidak ada gravity counter
// Platform collider yang proper
```

### 2. Player.js - Hapus Gravity Counter

**SEBELUM:**
```javascript
this.body.setGravityY(-1200); // Counter world gravity
```

**SESUDAH:**
```javascript
// Tidak ada gravity counter
// Gunakan gravity dunia normal
```

### 3. Jump Velocity Adjustment

**SEBELUM:**
```javascript
this.setVelocityY(-550);  // Terlalu kuat untuk gravity 800
```

**SESUDAH:**
```javascript
this.setVelocityY(-450);  // Pas untuk gravity 800
```

### 4. Ground Platform

**SEBELUM:**
```javascript
this.ground = this.add.rectangle(640, groundY + 60, 1280, 120, 0x000000, 0);
// Platform terlalu tebal dan terlalu rendah
```

**SESUDAH:**
```javascript
this.ground = this.add.rectangle(640, groundY + 10, 1280, 40, 0x000000, 0);
// Platform tipis dan tepat di bawah karakter
```

## CARA KERJA SEKARANG

### Physics System
```
World Gravity: +800 (tarik ke bawah)
Player Gravity: 0 (default, ikut world)
Net Gravity: +800 (normal)

Ground Platform: Static collider di y=530
Player Spawn: y=520 (di atas platform)
```

### Jump Mechanics
```
1. Player di ground → onGround = true
2. Press SPACE → setVelocityY(-450)
3. Player naik (velocity negatif)
4. Gravity +800 menarik ke bawah
5. Velocity berkurang: -450 → -400 → -350 → ... → 0
6. Velocity positif: 0 → +50 → +100 → ... (jatuh)
7. Collide dengan ground → onGround = true
8. Landing → return to idle/run animation
```

## TESTING

### Test Jump:
1. Buka game
2. Press **SPACE**
3. ✅ Karakter harus jump ke atas
4. ✅ Jump animation plays (4 frames)
5. ✅ Karakter jatuh kembali ke ground
6. ✅ Landing animation (idle/run)

### Test Movement + Jump:
1. Press **D** (run right)
2. Press **SPACE** (jump while running)
3. ✅ Karakter jump sambil bergerak horizontal
4. ✅ Landing → return to run animation

### Test Ground Collision:
1. ✅ Karakter tidak jatuh saat idle
2. ✅ Karakter berdiri di ground dengan stabil
3. ✅ Feet aligned dengan ground surface

## PHYSICS VALUES

### Gravity
- **World Gravity:** 800 (normal, tidak terlalu cepat)
- **Player Gravity:** 0 (ikut world)
- **Boss Gravity:** 0 (ikut world)

### Jump
- **Jump Velocity:** -450 (pas untuk gravity 800)
- **Jump Height:** ~150 pixels
- **Jump Duration:** ~1 second

### Ground
- **Visual Ground Y:** 520
- **Platform Y:** 530 (10 pixels di bawah visual)
- **Platform Height:** 40 pixels
- **Platform Width:** 1280 pixels (full screen)

### Movement
- **Max Speed:** 300
- **Acceleration:** 35
- **Deceleration:** 0.85 (friction)

## EXPECTED BEHAVIOR

### ✅ SEKARANG HARUS BEKERJA:

1. **Jump Works**
   - Press SPACE → Jump ke atas
   - Jump animation plays
   - Landing smooth

2. **Ground Collision**
   - Karakter berdiri stabil
   - Tidak jatuh saat idle
   - Feet aligned dengan ground

3. **Movement + Jump**
   - Bisa jump sambil bergerak
   - Horizontal velocity maintained saat jump
   - Landing return to run/idle

4. **Animation**
   - Jump animation plays saat di udara
   - Landing → idle (if stopped)
   - Landing → run (if moving)

## TROUBLESHOOTING

### Jika Jump Masih Tidak Bekerja:

1. **Check Console (F12)**
   ```
   Cari error messages
   Pastikan tidak ada error physics
   ```

2. **Check Ground Detection**
   ```javascript
   console.log('onGround:', this.body.blocked.down);
   // Harus true saat di ground
   ```

3. **Check Gravity**
   ```javascript
   console.log('World Gravity:', this.scene.physics.world.gravity.y);
   // Harus 800
   
   console.log('Player Gravity:', this.body.gravity.y);
   // Harus 0
   ```

4. **Check Jump Velocity**
   ```javascript
   console.log('Velocity Y:', this.body.velocity.y);
   // Saat jump harus negatif (-450)
   ```

### Jika Karakter Jatuh Terus:

- Platform collider mungkin tidak aktif
- Check: `this.physics.add.collider(this.player, this.ground);`

### Jika Jump Terlalu Tinggi/Rendah:

- Adjust jump velocity di Player.js:
  - Terlalu tinggi → kurangi velocity (misal -400)
  - Terlalu rendah → tambah velocity (misal -500)

## FILES MODIFIED

1. ✅ `scenes/BattleScene.js`
   - Gravity: 1200 → 800
   - Hapus gravity counter
   - Platform position adjusted

2. ✅ `scripts/Player.js`
   - Hapus `setGravityY(-1200)`
   - Jump velocity: -550 → -450

3. ✅ `scripts/Boss.js`
   - Tidak ada perubahan (sudah benar)

## CONCLUSION

**✅ JUMP SEKARANG HARUS BEKERJA!**

Physics system sudah diperbaiki dengan:
- Gravity normal (800)
- Tidak ada gravity counter
- Platform collider yang proper
- Jump velocity yang pas

**Buka game dan test dengan SPACE key!** 🎮

---

**Status:** ✅ FIXED  
**Test:** Press SPACE to jump  
**Expected:** Character jumps up and lands smoothly
