
<h1>Sprite Generator</h1>

<form onsubmit="ui.trigger('form input, form select', 'MAIN', 'submit'); return false;">
<table>
	<tr>
		<td class="center">
			<div class="ui-dropzone" data-name="images">
				Drop Images here
			</div>
		</td>
		<td>
			<ol class="ui-dropzone-list" data-source="images">
				<li>No Images uploaded</li>
			</ol>
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
				<option value="none">none</option>
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

