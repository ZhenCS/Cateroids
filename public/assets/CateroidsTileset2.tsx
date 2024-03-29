<?xml version="1.0" encoding="UTF-8"?>
<tileset version="1.2" tiledversion="1.2.3" name="CateroidsTileset2" tilewidth="64" tileheight="64" tilecount="24" columns="6">
 <image source="CateroidsTileset2.png" width="384" height="256"/>
 <tile id="0" type="asteroid">
  <properties>
   <property name="damage" type="float" value="20"/>
   <property name="health" type="float" value="40"/>
   <property name="level" type="int" value="0"/>
   <property name="spawnNumber" type="int" value="0"/>
   <property name="velocityX" type="float" value="0"/>
   <property name="velocityY" type="float" value="0"/>
  </properties>
 </tile>
 <tile id="1" type="asteroid">
  <properties>
   <property name="damage" type="float" value="15"/>
   <property name="health" type="float" value="20"/>
   <property name="level" type="int" value="1"/>
   <property name="spawnNumber" type="int" value="0"/>
   <property name="velocityX" type="float" value="0"/>
   <property name="velocityY" type="float" value="0"/>
  </properties>
 </tile>
 <tile id="2" type="asteroid">
  <properties>
   <property name="damage" type="float" value="10"/>
   <property name="health" type="float" value="10"/>
   <property name="level" type="int" value="2"/>
   <property name="spawnNumber" type="int" value="0"/>
   <property name="velocityX" type="float" value="0"/>
   <property name="velocityY" type="float" value="0"/>
  </properties>
 </tile>
 <tile id="3" type="asteroid">
  <properties>
   <property name="damage" type="float" value="500"/>
   <property name="hasDog" type="bool" value="false"/>
   <property name="health" type="float" value="300"/>
   <property name="level" type="int" value="3"/>
   <property name="spawnNumber" type="int" value="0"/>
   <property name="velocityX" type="int" value="0"/>
   <property name="velocityY" type="int" value="0"/>
  </properties>
 </tile>
 <tile id="4" type="laser">
  <properties>
   <property name="angleFactor" type="int" value="0"/>
   <property name="laserDamage" type="float" value="1"/>
   <property name="laserDelay" type="int" value="50"/>
   <property name="laserDuration" type="int" value="2500"/>
   <property name="laserFireDelay" type="int" value="1500"/>
   <property name="laserSprites" type="int" value="50"/>
   <property name="playerDeltaX" type="float" value="200"/>
   <property name="scale" type="float" value="4"/>
   <property name="spawnNumber" type="int" value="0"/>
   <property name="type" value="VERTICAL"/>
  </properties>
 </tile>
 <tile id="5" type="dog"/>
 <tile id="6" type="dog">
  <properties>
   <property name="damage" type="float" value="15"/>
   <property name="fireRate" type="float" value="1500"/>
   <property name="health" type="float" value="80"/>
   <property name="level" type="int" value="3"/>
   <property name="spawnNumber" type="int" value="0"/>
   <property name="velocityX" type="float" value="0"/>
   <property name="velocityY" type="float" value="0"/>
  </properties>
 </tile>
 <tile id="7" type="dog">
  <properties>
   <property name="damage" type="float" value="10"/>
   <property name="fireRate" type="float" value="1000"/>
   <property name="health" type="float" value="60"/>
   <property name="level" type="int" value="2"/>
   <property name="spawnNumber" type="int" value="0"/>
   <property name="velocityX" type="float" value="0"/>
   <property name="velocityY" type="float" value="0"/>
  </properties>
 </tile>
 <tile id="8" type="dog">
  <properties>
   <property name="damage" type="float" value="5"/>
   <property name="fireRate" type="float" value="800"/>
   <property name="health" type="float" value="30"/>
   <property name="level" type="int" value="1"/>
   <property name="spawnNumber" type="int" value="0"/>
   <property name="velocityX" type="float" value="0"/>
   <property name="velocityY" type="float" value="0"/>
  </properties>
 </tile>
 <tile id="9" type="spawnPoint">
  <properties>
   <property name="spawnNumber" type="int" value="0"/>
  </properties>
 </tile>
 <tile id="10" type="endPoint">
  <properties>
   <property name="spawnNumber" type="int" value="0"/>
  </properties>
 </tile>
 <tile id="12" type="text">
  <properties>
   <property name="hideOnDeltaX" type="float" value="0"/>
   <property name="showOnDeltaX" type="float" value="0"/>
   <property name="spawnNumber" type="int" value="0"/>
   <property name="text" value="placeholder text"/>
  </properties>
 </tile>
 <tile id="18" type="boss">
  <properties>
   <property name="bossType" value="placeholder"/>
   <property name="damage" type="float" value="20"/>
   <property name="health" type="float" value="1000"/>
   <property name="spawnNumber" type="int" value="0"/>
  </properties>
 </tile>
 <tile id="19" type="dog">
  <properties>
   <property name="damage" type="float" value="10"/>
   <property name="fireRate" type="float" value="1500"/>
   <property name="health" type="float" value="80"/>
   <property name="level" type="int" value="4"/>
   <property name="spawnNumber" type="int" value="0"/>
   <property name="velocityX" type="float" value="0"/>
   <property name="velocityY" type="float" value="0"/>
  </properties>
 </tile>
</tileset>
