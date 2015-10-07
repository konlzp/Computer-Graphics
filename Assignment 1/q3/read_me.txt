System: MAX_OS_X
Browser: Safari

To draw a filled triangle, we can make use of our line_drawing program, in that if we consider a filled triangle is, actually a set of lines each starts with a point of one of the triangle's border and ends in the other, through which we can draw a filled triangle by drawing lines.

However, I think it would be more efficient if we simply compare the points in adjacent area with the three equations we used to define the lines, and decide if the point is in the triangular area or not.
