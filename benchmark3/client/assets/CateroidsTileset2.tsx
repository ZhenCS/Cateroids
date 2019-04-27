<?xml version="1.0" encoding="UTF-8"?>
<tileset version="1.2" tiledversion="1.2.3" name="CateroidsTileset2" tilewidth="64" tileheight="64" tilecount="10" columns="5">
 <image source="CateroidsTileset2.png" width="320" height="128"/>
 <tile id="0" type="asteroid">
  <properties>
   <property name="VelocityX" type="float" value="0"/>
   <property name="VelocityY" type="float" value="0"/>
   <property name="asteroid0Damage" type="float" value="20"/>
   <property name="asteroid0Health" type="float" value="40"/>
  </properties>
 </tile>
 <tile id="1" type="asteroid">
  <properties>
   <property name="VelocityX" type="float" value="0"/>
   <property name="VelocityY" type="float" value="0"/>
   <property name="asteroid1Damage" type="float" value="15"/>
   <property name="asteroid1Health" type="float" value="20"/>
  </properties>
 </tile>
 <tile id="2" type="asteroid">
  <properties>
   <property name="VelocityX" type="float" value="0"/>
   <property name="VelocityY" type="float" value="0"/>
   <property name="asteroid2Damage" type="float" value="10"/>
   <property name="asteroid2Health" type="float" value="10"/>
  </properties>
 </tile>
 <tile id="3" type="asteroid">
  <properties>
   <property name="VelocityX" type="int" value="0"/>
   <property name="VelocityY" type="int" value="0"/>
   <property name="asteroid3Damage" type="float" value="500"/>
   <property name="asteroid3Health" type="float" value="100"/>
   <property name="oxygenReplenishDelay" type="int" value="50"/>
   <property name="oxygenReplenishRate" type="float" value="0.15"/>
  </properties>
 </tile>
 <tile id="4" type="laser">
  <properties>
   <property name="Type" value="VERTICAL"/>
   <property name="laserDamage" type="float" value="1"/>
   <property name="laserDelay" type="int" value="50"/>
   <property name="laserDuration" type="int" value="2500"/>
   <property name="laserSprites" type="int" value="50"/>
   <property name="playerDeltaX" type="float" value="200"/>
  </properties>
 </tile>
 <tile id="5" type="dog">
  <properties>
   <property name="VelocityX" type="float" value="0"/>
   <property name="VelocityY" type="float" value="0"/>
   <property name="dog3Damage" type="float" value="15"/>
   <property name="dog3FireRate" type="int" value="1500"/>
   <property name="dog3Health" type="float" value="80"/>
  </properties>
 </tile>
 <tile id="6" type="dog">
  <properties>
   <property name="VelocityX" type="float" value="0"/>
   <property name="VelocityY" type="float" value="0"/>
   <property name="dog2Damage" type="float" value="10"/>
   <property name="dog2FireRate" type="int" value="1000"/>
   <property name="dog2Health" type="float" value="60"/>
  </properties>
 </tile>
 <tile id="7" type="dog">
  <properties>
   <property name="VelocityX" type="float" value="0"/>
   <property name="VelocityY" type="float" value="0"/>
   <property name="dog1Damage" type="float" value="15"/>
   <property name="dog1FireRate" type="int" value="800"/>
   <property name="dog1Health" type="float" value="30"/>
  </properties>
 </tile>
 <tile id="8" type="spawnPoint"/>
 <tile id="9" type="endPoint"/>
</tileset>
