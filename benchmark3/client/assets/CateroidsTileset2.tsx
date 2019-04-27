<?xml version="1.0" encoding="UTF-8"?>
<tileset version="1.2" tiledversion="1.2.3" name="CateroidsTileset2" tilewidth="64" tileheight="64" tilecount="10" columns="5">
 <image source="CateroidsTileset2.png" width="320" height="128"/>
 <tile id="0" type="asteroid">
  <properties>
   <property name="damage" type="float" value="20"/>
   <property name="health" type="float" value="40"/>
   <property name="level" type="int" value="0"/>
   <property name="velocityX" type="float" value="0"/>
   <property name="velocityY" type="float" value="0"/>
  </properties>
 </tile>
 <tile id="1" type="asteroid">
  <properties>
   <property name="damage" type="float" value="15"/>
   <property name="health" type="float" value="20"/>
   <property name="level" type="int" value="1"/>
   <property name="velocityX" type="float" value="0"/>
   <property name="velocityY" type="float" value="0"/>
  </properties>
 </tile>
 <tile id="2" type="asteroid">
  <properties>
   <property name="damage" type="float" value="10"/>
   <property name="health" type="float" value="10"/>
   <property name="level" type="int" value="2"/>
   <property name="velocityX" type="float" value="0"/>
   <property name="velocityY" type="float" value="0"/>
  </properties>
 </tile>
 <tile id="3" type="asteroid">
  <properties>
   <property name="damage" type="float" value="500"/>
   <property name="health" type="float" value="300"/>
   <property name="level" type="int" value="3"/>
   <property name="oxygenReplenishDelay" type="int" value="50"/>
   <property name="oxygenReplenishRate" type="float" value="0.15"/>
   <property name="velocityX" type="int" value="0"/>
   <property name="velocityY" type="int" value="0"/>
  </properties>
 </tile>
 <tile id="4" type="laser">
  <properties>
   <property name="laserDamage" type="float" value="1"/>
   <property name="laserDelay" type="int" value="50"/>
   <property name="laserDuration" type="int" value="2500"/>
   <property name="laserSprites" type="int" value="50"/>
   <property name="playerDeltaX" type="float" value="200"/>
   <property name="scale" type="float" value="4"/>
   <property name="type" value="VERTICAL"/>
  </properties>
 </tile>
 <tile id="5" type="dog">
  <properties>
   <property name="damage" type="float" value="15"/>
   <property name="fireRate" type="float" value="1500"/>
   <property name="health" type="float" value="80"/>
   <property name="level" type="int" value="3"/>
   <property name="velocityX" type="float" value="0"/>
   <property name="velocityY" type="float" value="0"/>
  </properties>
 </tile>
 <tile id="6" type="dog">
  <properties>
   <property name="damage" type="float" value="10"/>
   <property name="fireRate" type="float" value="1000"/>
   <property name="health" type="float" value="60"/>
   <property name="level" type="int" value="2"/>
   <property name="velocityX" type="float" value="0"/>
   <property name="velocityY" type="float" value="0"/>
  </properties>
 </tile>
 <tile id="7" type="dog">
  <properties>
   <property name="damage" type="float" value="5"/>
   <property name="fireRate" type="float" value="800"/>
   <property name="health" type="float" value="30"/>
   <property name="level" type="int" value="1"/>
   <property name="velocityX" type="float" value="0"/>
   <property name="velocityY" type="float" value="0"/>
  </properties>
 </tile>
 <tile id="8" type="spawnPoint"/>
 <tile id="9" type="endPoint"/>
</tileset>
