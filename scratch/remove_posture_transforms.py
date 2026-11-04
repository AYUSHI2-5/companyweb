with open('main.js', 'r', encoding='utf-8') as f:
    c = f.read()

# Remove teacherPostureLayer reference
c = c.replace('    var teacherPostureLayer = document.getElementById(\'teacherPostureLayer\');\n', '')

# Remove posture transform in loop
old_block = '''      // Posture / Head tilt: directed toward board content (-1.2deg up to +1.8deg)
      var targetPosture = (targetArmAngle * 0.07) + headNod + naturalBreath;
      targetPostureAngle = Math.max(-1.8, Math.min(2.4, targetPosture));

      // Wrist angle: flexes to keep stylus oriented cleanly toward presentation
      targetWristAngle = (targetArmAngle * -0.15) + (highlightImpulse * 0.8) + explainingWristRot;

      // 3. Smooth Damped Spring / Lerp Integration
      if (!isInitialized) {
        currentArmAngle = targetArmAngle;
        currentPostureAngle = targetPostureAngle;
        currentWristAngle = targetWristAngle;
        wristOrbitX = explainingOrbitX;
        wristOrbitY = explainingOrbitY;
        isInitialized = true;
      } else {
        // Responsive Lerp damping
        currentArmAngle += (targetArmAngle - currentArmAngle) * 0.18;
        currentPostureAngle += (targetPostureAngle - currentPostureAngle) * 0.12;
        currentWristAngle += (targetWristAngle - currentWristAngle) * 0.22;
        wristOrbitX += (explainingOrbitX - wristOrbitX) * 0.15;
        wristOrbitY += (explainingOrbitY - wristOrbitY) * 0.15;
      }

      // 4. Apply Transforms to Respective Architectural Layers
      if (teacherArmLayer) {
        teacherArmLayer.style.transform = 'rotate(' + currentArmAngle.toFixed(2) + 'deg)';
      }

      if (teacherWristLayer) {
        teacherWristLayer.style.transform = 'translate(' + wristOrbitX.toFixed(2) + 'px, ' + wristOrbitY.toFixed(2) + 'px) rotate(' + currentWristAngle.toFixed(2) + 'deg)';
      }

      if (teacherPostureLayer) {
        teacherPostureLayer.style.transform = 'rotate(' + currentPostureAngle.toFixed(2) + 'deg)';
      }

      requestAnimationFrame(updateTeacherPresenterLoop);
    }

    if (teacherArmLayer || teacherPostureLayer) {'''

new_block = '''      // Wrist angle: flexes to keep stylus oriented cleanly toward presentation
      targetWristAngle = (targetArmAngle * -0.15) + (highlightImpulse * 0.8) + explainingWristRot;

      // 3. Smooth Damped Spring / Lerp Integration
      if (!isInitialized) {
        currentArmAngle = targetArmAngle;
        currentWristAngle = targetWristAngle;
        wristOrbitX = explainingOrbitX;
        wristOrbitY = explainingOrbitY;
        isInitialized = true;
      } else {
        // Responsive Lerp damping
        currentArmAngle += (targetArmAngle - currentArmAngle) * 0.18;
        currentWristAngle += (targetWristAngle - currentWristAngle) * 0.22;
        wristOrbitX += (explainingOrbitX - wristOrbitX) * 0.15;
        wristOrbitY += (explainingOrbitY - wristOrbitY) * 0.15;
      }

      // 4. Apply Transforms Only to Arm and Wrist Layers (Body remains 100% motionless)
      if (teacherArmLayer) {
        teacherArmLayer.style.transform = 'rotate(' + currentArmAngle.toFixed(2) + 'deg)';
      }

      if (teacherWristLayer) {
        teacherWristLayer.style.transform = 'translate(' + wristOrbitX.toFixed(2) + 'px, ' + wristOrbitY.toFixed(2) + 'px) rotate(' + currentWristAngle.toFixed(2) + 'deg)';
      }

      requestAnimationFrame(updateTeacherPresenterLoop);
    }

    if (teacherArmLayer) {'''

if old_block in c:
    c = c.replace(old_block, new_block, 1)
    print('Successfully removed posture transforms from loop!')
else:
    print('Target block not matched directly, checking variables...')

# Remove posture variables
c = c.replace('    var currentPostureAngle = 0.0;\n    var targetPostureAngle = 0.0;\n', '')

with open('main.js', 'w', encoding='utf-8') as f:
    f.write(c)

