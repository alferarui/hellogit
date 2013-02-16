/* 
 This file was generated by Dashcode and is covered by the 
 license.txt included in the project.  You may edit this file, 
 however it is recommended to first turn off the Dashcode 
 code generator otherwise the changes will be lost.
 */

// Note: Properties and methods beginning with underbar ("_") are considered private and subject to change in future Dashcode releases.

function CreateVerticalLevelIndicator(elementOrID, spec)
{
    var levelIndicatorElement = elementOrID;
    if (elementOrID.nodeType != Node.ELEMENT_NODE) {
        levelIndicatorElement = document.getElementById(elementOrID);
    }	
    if (!levelIndicatorElement.loaded) 
	{
		levelIndicatorElement.loaded = true;
		var onchanged = spec.onchange || null;
		try { onchanged = eval(onchanged); } catch (e) { onchanged = null; }
		levelIndicatorElement.object = new VerticalLevelIndicator(levelIndicatorElement, spec.value || 0, spec.minValue || 0, spec.maxValue || 0, spec.onValue || 0, spec.warningValue || 0, spec.criticalValue || 0, spec.spacing || 0, spec.stacked || false, spec.interactive || false, spec.continuous || false, spec.imageOff || null, spec.imageOn || null, spec.imageWarning || null, spec.imageCritical || null, spec.imageWidth || 0, spec.imageHeight || 0, onchanged, spec.originalID);
		return levelIndicatorElement.object;
	}
}

/*******************************************************************************
* VerticalLevelIndicator
* Implementation of LevelIndicator
*
*
*/

function VerticalLevelIndicator(levelIndicator, value, minValue, maxValue, onValue, warningValue, criticalValue, spacing, stacked, interactive, continuous, imageOff, imageOn, imageWarning, imageCritical, imageWidth, imageHeight, onchanged, originalID)
{
	/* Objects */
    this.element = levelIndicator
	this._levelIndicator = levelIndicator;
	
	/* public properties */
	// These are read-write. Set them as needed.
	this.onchanged = onchanged;
	this.continuous = continuous; // Fire onchanged live, as opposed to onmouseup
	
	// These are read-only. Use the setter functions to set them.
	this.value = value;
	
	/* Internal objects */
	this._track = null;
    this._originalID = originalID;
		
	this.imageWidth = imageWidth;
	this.imageHeight = imageHeight;
	this.imageOffPath = imageOff == null ? "Images/VerticalOff.png" : imageOff;
	this.imageOnPath = imageOn == null ? "Images/VerticalOn.png" : imageOn;
	this.imageWarningPath = imageWarning == null ? "Images/VerticalWarning.png" : imageWarning;
	this.imageCriticalPath = imageCritical == null ? "Images/VerticalCritical.png" : imageCritical;

	this._init(value, minValue, maxValue, onValue, warningValue, criticalValue, spacing, stacked, interactive, imageOn, imageOff, imageWarning, imageCritical, imageWidth, imageHeight);
}

// Inherit from LevelIndicator
VerticalLevelIndicator.prototype = new LevelIndicator(null);

VerticalLevelIndicator.prototype._getMousePosition = function(event)
{
	if (event !== undefined)
		return event.y;
	else
		return 0;
}

VerticalLevelIndicator.prototype._computeValueFromMouseEvent = function(event)
{
	var style = this._computedLevelIndicatorStyle;
	var top = style ? parseInt(style.getPropertyValue("top"), 10) : 0;
	var height = style ? parseInt(style.getPropertyValue("height"), 10) : 0;
	var position = this._getMousePosition(event);
	var newValue = this.minValue + (((this.maxValue - this.minValue) * ((top + height) - position)) / height);
	
	if (newValue < this.minValue)
		newValue = this.minValue;
	else if (newValue > this.maxValue)
		newValue = this.maxValue;

	return newValue;
}

VerticalLevelIndicator.prototype._computePositionFromValue = function(newValue)
{
	var style = this._computedLevelIndicatorStyle;
	var height = style ? parseInt(style.getPropertyValue("height"), 10) : 0;
	var position = (height * (newValue - this.minValue)) / (this.maxValue - this.minValue);
	
	return height - position;
}

VerticalLevelIndicator.prototype._computeValueFromPosition = function(position)
{
	var style = this._computedLevelIndicatorStyle;
	var height = style ? parseInt(style.getPropertyValue("height"), 10) : 0;
	var newValue = this.minValue + (((this.maxValue - this.minValue) * (height - position)) / height);
	
	return newValue;
}

VerticalLevelIndicator.prototype._computeLevelIndicatorLength = function()
{
	// get the current actual slider length
	var style = this._computedLevelIndicatorStyle;
	return style ? parseInt(style.getPropertyValue("height"), 10) : 0;
}

VerticalLevelIndicator.prototype._layoutElements = function()
{
	var length = this._computeLevelIndicatorLength();
	var valuePosition = this._computePositionFromValue(this.value);
	var delta = length - this.imageHeight;
	
	var imagePath = null;

	while (delta >= 0)
	{
		var element = document.createElement("div");
		var style = element.style;
		style.position = "absolute";
		style.display = "block";
		style.top = delta + "px";
		style.left = "0px";
		style.width = this.imageWidth + "px";
		style.height = this.imageHeight + "px";
		
		var currentValue = this.value;
		if (this.stacked)
		{
			currentValue = this._computeValueFromPosition(delta + this.imageHeight);
		}
		if (delta + this.imageHeight <= valuePosition)
			imagePath = this.imageOffPath;
		else if (currentValue >= this.criticalValue)
			imagePath = this.imageCriticalPath;
		else if (currentValue >= this.warningValue)
			imagePath = this.imageWarningPath;
		else if (this.value >= this.onValue)
			imagePath = this.imageOnPath;
        else
			imagePath = this.imageOffPath;
        
		style.background = "url(" + imagePath + ") no-repeat top left";
		this._track.appendChild(element);
					
		delta -= this.imageHeight + this.spacing;
	}
}
