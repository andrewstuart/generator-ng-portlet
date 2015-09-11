# [generator-ng-portlet](https://npmjs.org/andrewstuart/generator-ng-portlet)

A quick generator for creating a uniform portlet for running angular in a way
that it can be used by both portals and portlets without conflicts.

# Usage
```bash
npm install -g generator-ng-portlet;
cd <desired directory>;
yo ng-portlet portlet-name;
```

## Note

Currently only works for simplejsp portlets.

as such, <desired directory> must be
`uportal-portlets-overlay/jasig-widget-portlets/src/main/webapp/WEB-INF/jsp`,
or a subdirectory.
