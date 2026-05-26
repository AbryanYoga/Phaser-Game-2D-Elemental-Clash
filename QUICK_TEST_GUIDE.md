# QUICK TEST GUIDE - Animation System

## 🎮 HOW TO RUN THE GAME

### Option 1: Simple (Double-click)
1. Open `index.html` in your web browser
2. Game should start automatically

### Option 2: Local Server (Recommended)
```bash
# If you have Python installed:
python -m http.server 8000

# Then open browser to:
http://localhost:8000
```

---

## 🎯 WHAT TO TEST (5 MINUTES)

### 1️⃣ MOVEMENT (30 seconds)
**Keys:** A (left) and D (right)

**Expected Result:**
- ✅ Character runs smoothly with 6-frame animation
- ✅ Character flips to face movement direction
- ✅ Smooth acceleration when starting
- ✅ Smooth deceleration when stopping
- ✅ Returns to idle animation when stopped

**If it fails:**
- Check browser console (F12) for errors
- Look for: `[Player] Animation: idle → run`

---

### 2️⃣ JUMPING (30 seconds)
**Key:** SPACE

**Expected Result:**
- ✅ Character jumps with 4-frame animation
- ✅ Jump animation plays only while in air
- ✅ Landing returns to run (if moving) or idle (if stopped)
- ✅ NO frozen crouch frame
- ✅ Character lands on ground properly

**If it fails:**
- Check if character is spawning on ground
- Look for: `[Player] Animation: run → jump`

---

### 3️⃣ ATTACKING (1 minute)
**Keys:** 
- Left Mouse Click or J = Normal attack
- F or K = Special attack

**Expected Result:**
- ✅ Attack animation plays completely
- ✅ Animation locks during attack (can't move)
- ✅ Returns to idle/run after attack
- ✅ Special attack has orange glow effect
- ✅ Special cooldown shows in UI (4 seconds)

**If it fails:**
- Check if attack animation exists
- Look for attack sound effect

---

### 4️⃣ TAKING DAMAGE (1 minute)
**How:** Let the boss hit you

**Expected Result:**
- ✅ Red tint effect on player
- ✅ Knockback effect
- ✅ Screen shake
- ✅ **NO transparency/flicker effect**
- ✅ Player stays fully visible
- ✅ Red damage number appears
- ✅ HP bar decreases

**If it fails:**
- Check if player becomes transparent (THIS IS A BUG)
- Player should ALWAYS be fully visible

---

### 5️⃣ GROUND COLLISION (30 seconds)
**What to check:**

**Expected Result:**
- ✅ Player spawns on ground (not falling)
- ✅ Boss spawns on ground (not falling)
- ✅ Both characters' feet touch the stone ground
- ✅ No sinking into ground
- ✅ Jump and land correctly

**If it fails:**
- Characters falling = gravity issue
- Characters floating = spawn position issue

---

## 🐛 BROWSER CONSOLE CHECK

Press **F12** to open Developer Tools, then check Console tab.

### ✅ GOOD OUTPUT (No Errors):
```
[Player] Validating textures...
[Player] All textures validated ✓
[Player] Creating animations...
[Player] Created: idle
[Player] Created: run
[Player] Created: jump
[Player] Created: attack
[Player] Created: special
[Player] Created: hurt
[Player] Created: dead
[Player] Created: win
[Player] All animations created ✓
[Player] Initialized successfully
```

### ❌ BAD OUTPUT (Has Errors):
```
Error: Missing texture: player_run_1
Error: Animation 'run' not found
TypeError: Cannot read property 'key' of undefined
```

---

## 🎮 FULL CONTROLS

| Key | Action |
|-----|--------|
| **A** | Move Left |
| **D** | Move Right |
| **SPACE** | Jump |
| **Left Click** or **J** | Normal Attack (20 damage) |
| **F** or **K** | Special Attack (35 damage, 4s cooldown) |
| **ESC** | Skip intro cutscene |

---

## ✅ SUCCESS CRITERIA

If ALL of these work, the animation system is PERFECT:

1. ✅ Run animation plays when pressing A/D
2. ✅ Jump animation plays when pressing SPACE
3. ✅ Character returns to idle when standing still
4. ✅ Attack animations play completely
5. ✅ NO transparency when taking damage
6. ✅ Characters spawn on ground (not falling)
7. ✅ No frozen crouch frame
8. ✅ Smooth animation transitions
9. ✅ No console errors
10. ✅ Game feels responsive and polished

---

## 🚨 COMMON ISSUES & FIXES

### Issue: Run animation not playing
**Fix:** Check console for texture errors. All run_1 to run_6 must load.

### Issue: Character stuck on crouch frame
**Fix:** This should be FIXED. If it still happens, jump animation has `repeat: -1` (should be `repeat: 0`)

### Issue: Character becomes transparent after hit
**Fix:** This should be FIXED. If it still happens, check for alpha tweens in takeDamage()

### Issue: Characters falling through ground
**Fix:** Check BattleScene.js ground collider setup

### Issue: Animations not smooth
**Fix:** Check frame rate settings in animation creation

---

## 📊 EXPECTED PERFORMANCE

- **FPS:** 60 (smooth gameplay)
- **Load Time:** < 3 seconds
- **Animation FPS:** 8-20 depending on animation
- **Input Lag:** None (instant response)

---

## 🎯 FINAL CHECK

After 5 minutes of testing, you should feel:
- ✅ Movement is smooth and responsive
- ✅ Animations look professional
- ✅ Combat feels satisfying
- ✅ No visual glitches
- ✅ Game is fun to play

**If YES to all → Animation system is COMPLETE! 🎉**

**If NO to any → Check console and report specific issue**

---

## 📝 REPORT FORMAT (If Issues Found)

```
ISSUE: [Describe what's wrong]
EXPECTED: [What should happen]
ACTUAL: [What actually happens]
CONSOLE: [Any error messages]
STEPS: [How to reproduce]
```

Example:
```
ISSUE: Run animation not playing
EXPECTED: Character should run with 6-frame animation
ACTUAL: Character slides without animation
CONSOLE: Error: Missing texture: player_run_1
STEPS: Press D key
```

---

**Test Time:** 5 minutes
**Difficulty:** Easy
**Status:** Ready for testing

Good luck! 🎮
