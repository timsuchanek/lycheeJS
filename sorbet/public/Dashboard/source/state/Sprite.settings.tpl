
<h1>Sprite Generator</h1>

<form onsubmit="ui.trigger('form input, form select', 'MAIN', 'submit'); return false;">
<table>
	<tr>
		<td class="center">
			<div class="ui-dropzone ui-upload">
				Drop Images here
			</div>
		</td>
		<td>
			<ol class="ui-upload-list">
				<li>No Images uploaded</li>
			</ol>
		</td>
	</tr>
	<tr class="div"></tr>
	<tr>
		<td colspan="2">
			Hint: The filenames of the uploaded images can trigger
			additional functionality.
			<br>
			For example, the images [ default_01.png, yanimated_01.png, yanimated_02.png, znotanimated_02.png ]
			will trigger the following generated state map (when you use "use image name" in both settings).
		</td>
	</tr>
	<tr>
		<td class="right" colspan="2">
			<button class="ui-toggle" data-target="example01">Show Example</button>
		</td>
	</tr>
	<tr id="example01" class="ui-state-hidden">
		<td colspan="2">
			The sprite algorithm optimizes the spritesheet automatically power-of-two, so the sprite image size
			for this example is 128x128. Also, this example has used a tile-based setting (bounding box: use frame size).
		</td>
		<td colspan="2">
			<pre class="javascript">
{
	"states": {
		"default": {
			"width":     64,
			"height":    64,
			"animation": false
		},
		"yanimated": {
			"width":     64,
			"height":    64,
			"animation": true
		},
		"znotanimated": {
			"width":     64,
			"height":    64,
			"animation": false
		}
	},
	"map": {
		"default": [
			{ "x":  0, "y":  0, "w": 64, "h": 64 }
		],
		"yanimated": [
			{ "x": 64, "y":  0, "w": 64, "h": 64 },
			{ "x":  0, "y": 64, "w": 64, "h": 64 }
		],
		"znotanimated": [
			{ "x": 64, "y": 64, "w": 64, "h": 64 }
		]
	}
}
			</pre>
		</td>
	</tr>
	<tr class="div"></tr>
	<tr>
		<th>Frame Size</th>
		<td>
			<select name="framesize">
				<option value="16">16</option>
				<option value="32">32</option>
				<option value="64" selected>64</option>
				<option value="128">128</option>
				<option value="256">256</option>
				<option value="512">512</option>
				<option value="1024">1024</option>
			</select>
		</td>
	</tr>
	<tr>
		<th>Frame Alignment</th>
		<td>
			<select name="framealign">
				<option value="center-center" selected>center center</option>
				<option value="top-left">top left</option>
				<option value="top-center">top center</option>
				<option value="top-right">top right</option>
				<option value="center-right">center right</option>
				<option value="bottom-right">bottom right</option>
				<option value="bottom-center">bottom center</option>
				<option value="bottom-left">bottom left</option>
				<option value="center-left">center left</option>
			</select>
		</td>
	</tr>
	<tr>
		<th>Bounding Box</th>
		<td>
			<select name="boundingbox">
				<option value="image" selected>use image size</option>
				<option value="frame">use frame size</option>
				<option value="none">no bounding box</option>
			</select>
		</td>
	</tr>
	<tr class="div"></tr>
	<tr>
		<th>State Map</th>
		<td>
			<select name="statemap">
				<option value="image" selected>use image name</option>
				<option value="none">no state map</option>
			</select>
		</td>
	</tr>
	<tr>
		<th>State Animation</th>
		<td>
			<select name="stateanimation">
				<option value="image" selected>use image name</option>
				<option value="none">no state animations</option>
			</select>
		</td>
	</tr>
	<tr class="div"></tr>
	<tr>
		<td class="right" colspan="2">
			<input type="submit" value="Generate">
		</td>
	</tr>
</table>
</form>

