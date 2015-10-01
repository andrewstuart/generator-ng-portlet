# [generator-ng-portlet](https://www.npmjs.com/package/generator-ng-portlet)

A quick generator for creating a portlet using Angular in such a way that
Angular will [remain a
good-citizen](https://github.com/Jasig/uPortal/blob/master/docs/USING_ANGULAR.md)
and will run with as little conflict as possible with other instances of Angular
portlets or portal skins.

If you choose to allow it, it will also automatically run `ant data-import` for
you with the new XML file (if created).

# Usage
```bash
npm install -g generator-ng-portlet yo;
cd <desired directory>;
yo ng-portlet portlet-name;
```

## Note

Currently only works for simplejsp portlets.

This generator should automatically create a sipmlejsp portlet in the overlay
directory. If you confirm that it should scaffold support files, it will add the
required xml portlet-definition in the given location.
