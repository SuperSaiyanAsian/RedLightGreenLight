#version 330 compatibility

uniform sampler2D 	uTexUnit;			// texture unit
uniform bool		uTexOn;				// texture toggle
uniform float  		uKa, uKd, uKs;		// coefficients of each type of lighting; adds up to one
uniform vec3  		uColor;				// object color
uniform vec3  		uSpecularColor;		// light color
uniform float   	uShininess;			// specular exponent

in  vec2  vST;							// texture coords
in  vec3  vN;							// normal vector
in  vec3  vL;							// vector from point to light
in  vec3  vE;							// vector from point to eye

void
main( )
{
	vec3 Normal = normalize(vN);
	vec3 Light  = normalize(vL);
	vec3 Eye    = normalize(vE);

	vec3 myColor = uColor;
	vec3 ambient = uKa * myColor;

	float d = max( dot(Normal,Light), 0. );       // only do diffuse if the light can see the point

	// Force right arm to have diffuse
	if (d == 0)
		d = -dot(Normal,Light);

	vec3 diffuse = uKd * d * myColor;

	float s = 0.;
	if( dot(Normal,Light) > 0. || !gl_FrontFacing)	          // only do specular if the light can see the point
	{
		vec3 ref = normalize(  reflect( -Light, Normal )  );
		s = pow( max( dot(Eye,ref),0. ), uShininess );
	}
	vec3 specular = uKs * s * uSpecularColor;

	vec3 newcolor = texture( uTexUnit, vST ).rgb;

	if (uTexOn)
	{
		gl_FragColor = vec4( newcolor, 1. );		// display texture
	}

	else
		gl_FragColor = vec4( ambient + diffuse + specular,  1. );
}
